"use client";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import React, { PointerEvent } from "react";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    // Update from ClientX and ClientY to PageX and PageY for full page cursor tracking
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  };

  const handlePointerLeave = () => updateMyPresence({ cursor: null });

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {/* Filter out only the once who have a cursor value*/}
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
      {children}
    </div>
  );
}

export default LiveCursorProvider;
