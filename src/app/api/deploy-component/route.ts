import { NextRequest, NextResponse } from "next/server";
import { writeFile, access } from "fs/promises";
import path from "path";

const UI_DIR = path.join(process.cwd(), "src", "components", "ui");

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Component deployment is only available in development" },
      { status: 403 },
    );
  }

  try {
    const { componentName, code, overwrite } = await request.json();

    if (!componentName || !code) {
      return NextResponse.json(
        { error: "componentName and code are required" },
        { status: 400 },
      );
    }

    if (!/^[A-Z][a-zA-Z0-9]+$/.test(componentName)) {
      return NextResponse.json(
        {
          error:
            "Component name must be PascalCase (e.g. StatusCard, DataTable)",
        },
        { status: 400 },
      );
    }

    const filePath = path.join(UI_DIR, `${componentName}.tsx`);
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve(UI_DIR))) {
      return NextResponse.json(
        { error: "Invalid component name" },
        { status: 400 },
      );
    }

    if (!overwrite) {
      try {
        await access(filePath);
        return NextResponse.json(
          {
            error: `${componentName}.tsx already exists`,
            exists: true,
          },
          { status: 409 },
        );
      } catch {
        // File doesn't exist, proceed
      }
    }

    await writeFile(filePath, code, "utf-8");

    return NextResponse.json({
      success: true,
      path: `src/components/ui/${componentName}.tsx`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to deploy component" },
      { status: 500 },
    );
  }
}
