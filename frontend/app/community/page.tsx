"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AnonymousIdentity,
  ReactionPost,
  createIdentity,
  getFollows,
  getIdentity,
  getPosts,
  summarizePosts,
  toggleFollow,
  updatePost,
} from "@/lib/glowcheck";

const voteLabels = ["Same happened to me", "This helped me", "Helpful", "Report"];

export default function CommunityPage() {
  const [identity, setIdentity] = useState<AnonymousIdentity | null>(null);
  const [alias, setAlias] = useState("");
  const [posts, setPosts] = useState<ReactionPost[]>([]);
  const [query, setQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState("All products");
  const [follows, setFollows] = useState<number[]>([]);

  useEffect(() => {
    setIdentity(getIdentity());
    setPosts(getPosts());
    setFollows(getFollows());
    const product = new URLSearchParams(window.location.search).get("product");
    if (product) {
      setActiveProduct(product);
    }
  }, []);

  const productNames = useMemo(
    () => [
      "All products",
      ...Array.from(new Set([...posts.map((post) => post.productName).filter(Boolean), activeProduct].filter((product) => product !== "All products"))),
    ],
    [activeProduct, posts],
  );

  const filteredPosts = useMemo(() => {
    const search = query.toLowerCase();
    return posts.filter((post) => {
      const matchesProduct = activeProduct === "All products" || post.productName === activeProduct;
      const matchesSearch =
        !search ||
        `${post.productName} ${post.story} ${post.symptoms.join(" ")} ${post.aiRecommendation}`.toLowerCase().includes(search);
      return matchesProduct && matchesSearch;
    });
  }, [activeProduct, posts, query]);

  const selectedProductPosts =
    activeProduct === "All products" ? filteredPosts : posts.filter((post) => post.productName === activeProduct);
  const summary = summarizePosts(selectedProductPosts);
  const selectedProductId = selectedProductPosts.find((post) => post.productId)?.productId;
  const isFollowing = selectedProductId ? follows.includes(selectedProductId) : false;

  const requireIdentity = () => {
    if (identity) return identity;
    const nextIdentity = createIdentity(alias);
    setIdentity(nextIdentity);
    return nextIdentity;
  };

  const vote = (post: ReactionPost, label: string) => {
    requireIdentity();
    if (post.userVotes.includes(label)) return;
    const updatedPost = {
      ...post,
      votes: { ...post.votes, [label]: (post.votes[label] || 0) + 1 },
      userVotes: [...post.userVotes, label],
      updatedAt: new Date().toISOString(),
    };
    updatePost(updatedPost);
    setPosts(getPosts());
  };

  const followProduct = () => {
    requireIdentity();
    setFollows(toggleFollow(selectedProductId));
  };

  const saveFollowUp = (event: FormEvent<HTMLFormElement>, post: ReactionPost) => {
    event.preventDefault();
    requireIdentity();
    const data = new FormData(event.currentTarget);
    const updatedPost = {
      ...post,
      improved: String(data.get("improved") || ""),
      stoppedProduct: String(data.get("stoppedProduct") || ""),
      outcome: String(data.get("outcome") || ""),
      wouldRecommend: String(data.get("wouldRecommend") || ""),
      credibilityBadges: Array.from(new Set([...post.credibilityBadges, "30-day follow-up completed"])),
      verifiedStatus: Boolean(post.productName && post.timeline && post.symptoms.length && post.severity),
      updatedAt: new Date().toISOString(),
    };
    updatePost(updatedPost);
    setPosts(getPosts());
  };

  return (
    <main className="min-h-screen bg-dark-900 px-4 py-8">
      <div className="fixed inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-600/10 to-accent-600/20 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-2xl font-black gradient-text">
            GlowGuide
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link className="rounded-full border border-gray-700 px-4 py-2 text-gray-200" href="/glowcheck">
              GlowCheck
            </Link>
            <Link className="rounded-full border border-gray-700 px-4 py-2 text-gray-200" href="/results">
              Results
            </Link>
          </nav>
        </header>

        <section className="mb-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-accent-300">Community reactions</p>
            <h1 className="text-4xl font-black md:text-6xl">Anonymous product experiences.</h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Browse self-reported reactions, product summaries, and follow-up outcomes. Posts are community experiences and do not mean a product is unsafe for everyone.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-white/[0.05] p-5">
            <p className="text-sm text-gray-400">Posting, reactions, follows, and photo requests use a local anonymous profile.</p>
            {identity ? (
              <p className="mt-3 rounded-xl bg-accent-500/10 px-4 py-3 font-semibold text-accent-100">{identity.name}</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <input
                  value={alias}
                  onChange={(event) => setAlias(event.target.value)}
                  placeholder="Alias, optional"
                  className="rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 outline-none focus:border-primary-400"
                />
                <button onClick={() => setIdentity(createIdentity(alias))} className="rounded-xl bg-white px-4 py-3 font-bold text-dark-900">
                  Continue anonymously
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mb-6 grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product, symptom, story, or recommendation"
            className="rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 outline-none focus:border-primary-400"
          />
          <Link href="/glowcheck" className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-3 text-center font-bold">
            Post a reaction
          </Link>
        </section>

        <section className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {productNames.map((product) => (
            <button
              key={product}
              onClick={() => setActiveProduct(product)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                activeProduct === product
                  ? "border-primary-300 bg-primary-500/20 text-white"
                  : "border-gray-700 bg-dark-800 text-gray-300"
              }`}
            >
              {product}
            </button>
          ))}
        </section>

        <section className="mb-8 rounded-2xl border border-gray-800 bg-white/[0.05] p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-black">{activeProduct === "All products" ? "Reaction summary" : activeProduct}</h2>
              <p className="mt-2 text-sm text-gray-400">
                {summary.riskLabel}. This does not mean the product is unsafe for everyone. It means verified GlowGuide reports show a pattern among some users.
              </p>
            </div>
            {activeProduct !== "All products" && (
              <button
                onClick={followProduct}
                className="rounded-full border border-accent-300 px-4 py-2 text-sm font-bold text-accent-100"
              >
                {isFollowing ? "Following" : "Follow product"}
              </button>
            )}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <SummaryTile label="Reports" value={selectedProductPosts.length} />
            <SummaryTile label="Verified" value={summary.verifiedCount} />
            <SummaryTile label="Most common timeline" value={summary.topTimeline?.[0] || "Not enough data"} />
            <SummaryTile label="Top symptom" value={summary.topSymptoms[0]?.[0] || "Not enough data"} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SummaryList title="Reported symptoms" entries={summary.topSymptoms} suffix="users reported" />
            <SummaryList title="Common mixed actives" entries={summary.topActives} suffix="reports included" />
          </div>
        </section>

        <div className="grid gap-5">
          {filteredPosts.map((post, index) => (
            <ReactionCard
              key={post.id}
              post={post}
              index={index}
              onVote={(label) => vote(post, label)}
              onFollowUp={(event) => saveFollowUp(event, post)}
              onRequestPhoto={requireIdentity}
            />
          ))}
          {filteredPosts.length === 0 && (
            <div className="rounded-2xl border border-gray-800 bg-white/[0.05] p-10 text-center text-gray-400">
              No reaction posts match this search yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SummaryTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-dark-800/70 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function SummaryList({ title, entries, suffix }: { title: string; entries: [string, number][]; suffix: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-dark-800/70 p-4">
      <h3 className="mb-3 font-bold">{title}</h3>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map(([label, count]) => (
            <p key={label} className="text-sm text-gray-300">
              {count} {suffix} {label}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Not enough data yet.</p>
      )}
    </div>
  );
}

function ReactionCard({
  post,
  index,
  onVote,
  onFollowUp,
  onRequestPhoto,
}: {
  post: ReactionPost;
  index: number;
  onVote: (label: string) => void;
  onFollowUp: (event: FormEvent<HTMLFormElement>) => void;
  onRequestPhoto: () => AnonymousIdentity;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.2) }}
      className="rounded-2xl border border-gray-800 bg-white/[0.05] p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent-300">{post.anonymousName}</p>
          <h2 className="mt-1 text-2xl font-black">{post.productName}</h2>
          <p className="mt-1 text-sm text-gray-400">
            {post.timeline} · {post.skinArea.join(", ") || "Area not shared"} · {post.severity}
            {post.skinType ? ` · ${post.skinType} skin` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.credibilityBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">
              {badge}
            </span>
          ))}
          {post.verifiedStatus && (
            <span className="rounded-full border border-accent-300 bg-accent-500/20 px-3 py-1 text-xs font-bold text-accent-100">
              GlowGuide reviewed
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.symptoms.map((symptom) => (
          <span key={symptom} className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-100">
            {symptom}
          </span>
        ))}
      </div>

      {post.story && <p className="mt-4 text-gray-200">{post.story}</p>}

      <div className="mt-4 rounded-xl border border-primary-400/30 bg-primary-500/10 p-4">
        <p className="text-sm font-bold text-primary-100">{post.aiRecommendation}</p>
        <p className="mt-1 text-sm text-gray-300">{post.aiExplanation}</p>
      </div>

      <div className="mt-4">
        {post.photoDataUrl && post.photoVisibility === "public" ? (
          <img src={post.photoDataUrl} alt="Public reaction" className="max-h-80 w-full rounded-xl border border-gray-800 object-cover" />
        ) : post.photoDataUrl ? (
          <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-dark-800/70 px-4 py-3 text-sm text-gray-300">
            <span>Photo private</span>
            <button onClick={() => onRequestPhoto()} className="rounded-full border border-gray-700 px-3 py-1 text-xs">
              Request photo access
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No photo attached</p>
        )}
      </div>

      {post.outcome && (
        <div className="mt-4 rounded-xl border border-accent-400/30 bg-accent-500/10 p-4 text-sm text-accent-50">
          <p className="font-bold">30-day follow-up</p>
          <p className="mt-1">{post.outcome}</p>
          <p className="text-gray-300">Recommend now: {post.wouldRecommend || "Not shared"}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {voteLabels.map((label) => (
          <button
            key={label}
            onClick={() => onVote(label)}
            className="rounded-full border border-gray-700 px-3 py-2 text-xs text-gray-300 hover:border-primary-400 hover:text-white"
          >
            {label} · {post.votes[label] || 0}
          </button>
        ))}
      </div>

      <details className="mt-4 rounded-xl border border-gray-800 bg-dark-800/60 p-4">
        <summary className="cursor-pointer text-sm font-bold text-gray-200">Add 30-day follow-up</summary>
        <form onSubmit={onFollowUp} className="mt-4 grid gap-3 md:grid-cols-2">
          <Select name="improved" label="Did your skin improve?" values={["Yes", "No", "A little", "Not sure"]} />
          <Select name="stoppedProduct" label="Did you stop the product?" values={["Stopped", "Continued", "Paused then restarted"]} />
          <Select
            name="outcome"
            label="Final outcome"
            values={[
              "Stopped and improved",
              "Stopped but no change",
              "Continued and improved",
              "Continued and got worse",
              "Dermatologist told me to stop",
            ]}
          />
          <Select name="wouldRecommend" label="Would you recommend it now?" values={["Yes", "No", "Only for some skin types", "Not sure"]} />
          <button className="rounded-xl bg-white px-4 py-3 font-bold text-dark-900 md:col-span-2">Save follow-up</button>
        </form>
      </details>
    </motion.article>
  );
}

function Select({ name, label, values }: { name: string; label: string; values: string[] }) {
  return (
    <label className="text-sm text-gray-300">
      {label}
      <select name={name} className="mt-2 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 text-white">
        {values.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </label>
  );
}
