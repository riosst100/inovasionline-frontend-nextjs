import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { Smartphone, Download, CalendarClock, Tag, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Download Aplikasi",
};

export const dynamic = "force-dynamic";

type Release = {
  version: string;
  buildNumber?: number;
  date: string;
  filename: string;
};

async function getRelease(): Promise<Release | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "downloads", "release.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default async function DownloadPage() {
  const release = await getRelease();

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-md shadow-accent/30">
          <Smartphone className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Download Aplikasi</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Unduh aplikasi Inovasi Online untuk Android dan nikmati pengalaman belanja yang lebih
          praktis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inovasi Online</CardTitle>
          <CardDescription>Aplikasi resmi untuk Android</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>
                Versi{" "}
                <span className="font-medium text-foreground">
                  {release?.version ?? "-"}
                </span>
              </span>
            </div>
            {release?.buildNumber != null && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>
                  Build{" "}
                  <span className="font-medium text-foreground">
                    {release.buildNumber}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <span>
                Terakhir diperbarui{" "}
                <span className="font-medium text-foreground">
                  {release ? formatDate(release.date) : "-"}
                </span>
              </span>
            </div>
          </div>

          <Button asChild size="lg" className="w-full">
            <a
              href={release ? `/downloads/${release.filename}` : "#"}
              download
              aria-disabled={!release}
            >
              <Download />
              Download APK
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
