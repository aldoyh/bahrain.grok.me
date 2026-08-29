import { useEffect, useRef } from "react";
import { attachFeed, destroyAllFeeds, detachFeed, syncFeedMute } from "@/lib/mixer/players";
import { useMixer } from "@/lib/mixer/store";
import type { InputFeed } from "@/lib/mixer/feeds";

function signature(feed: InputFeed) {
  return `${feed.kind}|${feed.url}|${feed.playbackUrl ?? ""}`;
}

export function FeedEngine() {
  const feeds = useMixer((s) => s.feeds);
  const programId = useMixer((s) => s.programId);
  const masterMuted = useMixer((s) => s.mutes.master);
  const attached = useRef(new Map<string, string>());

  useEffect(() => {
    const wanted = new Set(Object.keys(feeds));
    for (const [id, sig] of attached.current) {
      if (!wanted.has(id) || signature(feeds[id]!) !== sig) {
        detachFeed(id);
        attached.current.delete(id);
      }
    }
    for (const [id, feed] of Object.entries(feeds)) {
      const sig = signature(feed);
      if (attached.current.get(id) === sig) continue;
      attached.current.set(id, sig);
      attachFeed(id, feed, (status, error) => useMixer.getState().setFeedStatus(id, status, error));
    }
  }, [feeds]);

  useEffect(() => {
    syncFeedMute(programId, masterMuted);
  }, [programId, masterMuted, feeds]);

  useEffect(() => {
    return () => {
      destroyAllFeeds();
      attached.current.clear();
    };
  }, []);

  return null;
}
