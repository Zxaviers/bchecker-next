import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/bottleneck/route";

const valid = {
  cpuId: "intel-core-i3-13100",
  gpuId: "nvidia-geforce-rtx-3090",
  resolutionId: "fhd",
  purposeId: "gaming",
};

const post = (body: string) =>
  POST(
    new Request("http://localhost/api/bottleneck", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }),
  );

describe("POST /api/bottleneck", () => {
  test("200 with the full result shape", async () => {
    const res = await post(JSON.stringify({ ...valid, ramGb: 8 }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({
      cpuName: "Intel Core i3-13100",
      gpuName: "NVIDIA GeForce RTX 3090",
      limiting: "CPU",
      note: "Upgrade CPU",
    });
    expect(typeof json.bottleneck).toBe("number");
    expect(typeof json.cpuScore).toBe("number");
    expect(typeof json.gpuScore).toBe("number");
    expect(typeof json.gpuShare).toBe("number");
    expect(typeof json.cpuPower).toBe("number");
    expect(typeof json.gpuPower).toBe("number");
    expect(json.advisories.map((a: { id: string }) => a.id)).toEqual(["ram-gaming-16"]);
  });

  test("400 for a body that is not JSON", async () => {
    const res = await post("not json");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_input" });
  });

  test("400 for an empty body", async () => {
    const res = await post("");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_input" });
  });

  test("400 for an invalid option value", async () => {
    const res = await post(JSON.stringify({ ...valid, refreshHz: 75 }));
    expect(res.status).toBe(400);
  });

  test("404 for an unknown part", async () => {
    const res = await post(JSON.stringify({ ...valid, gpuId: "nope" }));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});
