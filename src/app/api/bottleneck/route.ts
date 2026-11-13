import { lookup } from "@/lib/lookup";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const result = lookup(body);
  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.error === "not_found" ? 404 : 400 },
    );
  }

  const { cpu, gpu, estimate, advisories } = result;
  return Response.json({
    cpuName: cpu.name,
    gpuName: gpu.name,
    cpuScore: cpu.score,
    gpuScore: gpu.score,
    bottleneck: estimate.bottleneck,
    limiting: estimate.limiting,
    note: estimate.note,
    gpuShare: estimate.gpuShare,
    cpuPower: estimate.cpuPower,
    gpuPower: estimate.gpuPower,
    advisories,
  });
}
