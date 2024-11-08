"use client";
import React, { useEffect, useState } from "react";
import { runAll } from "@/lib/stuff";

export default function ClassPage() {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(runAll());
  },[]);

  return <div>{text}</div>;
}
