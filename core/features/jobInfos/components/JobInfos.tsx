import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Card, CardContent } from "@core/components/ui/card";
import { Button } from "@core/components/ui/button";
import { JobInfoForm } from "@/core/features/jobInfos/components/JobInfoForm";
import { JobInfoCard } from "@/core/features/jobInfos/components/JobInfoCard";
import { getJobInfos } from "@/core/features/jobInfos/actions";
import { routes } from "@/core/data/routes";

export async function JobInfos() {
  const jobInfos = await getJobInfos();

  if (jobInfos.length === 0) {
    return <NoJobInfos />;
  }

  return (
    <div className="container my-4">
      <div className="flex gap-2 justify-between mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">
          Select a job description
        </h1>
        <Button asChild>
          <Link href={routes.newJobInfo}>
            <PlusIcon />
            Create Job Description
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link
          className="transition-opacity hover:[.job-info-card]:opacity-70"
          href={routes.newJobInfo}>
          <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
            <div className="text-lg flex items-center gap-2">
              <PlusIcon className="size-6" />
              New Job Description
            </div>
          </Card>
        </Link>
        {jobInfos.map((jobInfo) => (
          <JobInfoCard key={jobInfo.id} jobInfo={jobInfo} />
        ))}
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container my-8 max-w-5xl">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
        Welcome to Landr
      </h1>
      <p className="text-muted-foreground mb-8">
        To get started, enter information about the type of job you want to
        apply for. This can be specific information copied directly from a job
        listing or general information such as the tech stack you want to work
        in. The more specific you are in the description the closer the test
        interviews will be to the real thing.
      </p>

      <Card className="p-6 border-dashed border-2 border-muted">
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
