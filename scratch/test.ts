import { createServerFn } from "@tanstack/react-start";
const x = createServerFn({ method: "POST" });
console.log(Object.keys(x));
