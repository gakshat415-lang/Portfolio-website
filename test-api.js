const test = async () => {
  console.log("--- 1. Valid Comment Submission ---");
  const res1 = await fetch("http://localhost:3000/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: "p1", guest_name: "Alice", comment_text: "Great post!" })
  });
  console.log("Status:", res1.status, await res1.json());

  console.log("\n--- 2. Honeypot Trigger ---");
  const res2 = await fetch("http://localhost:3000/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: "p1", guest_name: "Bot", comment_text: "Spam", honeypot: "true" })
  });
  console.log("Status:", res2.status, await res2.json());

  console.log("\n--- 3. Rate Limit Enforcement ---");
  // We already made 2 requests from localhost (1 valid, 1 honeypot - wait, honeypot is checked BEFORE rate limit?
  // Let's look at the code: rate limit is checked FIRST.
  // So res1=1, res2=2. 
  // Let's send 2 more to hit the limit. Limit is 3. So 4th should be 429.
  const res3 = await fetch("http://localhost:3000/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: "p1", guest_name: "Bob", comment_text: "Hi" })
  });
  console.log("Status 3:", res3.status);

  const res4 = await fetch("http://localhost:3000/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: "p1", guest_name: "Bob", comment_text: "Hi 2" })
  });
  console.log("Status 4:", res4.status, await res4.json());
};

test().catch(console.error);
