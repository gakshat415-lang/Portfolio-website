const test = async () => {
  console.log("--- 1. Valid Subscription ---");
  const email1 = `test_${Date.now()}@example.com`;
  const res1 = await fetch("http://localhost:3000/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email1 })
  });
  console.log("Status:", res1.status, await res1.json());

  console.log("\n--- 2. Duplicate Prevention ---");
  const res2 = await fetch("http://localhost:3000/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email1 })
  });
  console.log("Status:", res2.status, await res2.json());

  console.log("\n--- 3. Honeypot Validation ---");
  const res3 = await fetch("http://localhost:3000/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bot@spam.com", honeypot: "true" })
  });
  console.log("Status:", res3.status, await res3.json());
};

test().catch(console.error);
