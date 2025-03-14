"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Edit,
  Trash,
  Download,
  MoreHorizontal,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { enqueueSnackbar } from "notistack";

interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  status: "draft" | "in-review" | "completed";
  employeeName: string;
}

// Mock data
const initialReports: Report[] = [
  {
    id: "1",
    title: "Weekly Sales Report",
    content: "Completed all sales targets for the week. Total revenue: $15,000",
    createdAt: new Date(2023, 4, 15),
    status: "completed",
    employeeName: "John Doe",
  },
  {
    id: "2",
    title: "Customer Service Feedback",
    content: "Addressed 25 customer inquiries and resolved 20 tickets.",
    createdAt: new Date(2023, 4, 16),
    status: "in-review",
    employeeName: "Jane Smith",
  },
  {
    id: "3",
    title: "Marketing Campaign Progress",
    content:
      "Started new social media campaign. Initial metrics show good engagement.",
    createdAt: new Date(2023, 4, 17),
    status: "draft",
    employeeName: "Mike Johnson",
  },
  {
    id: "4",
    title: "Inventory Check",
    content:
      "Completed inventory audit. Found 5 discrepancies that need review.",
    createdAt: new Date(2023, 4, 18),
    status: "draft",
    employeeName: "Sarah Williams",
  },
  {
    id: "5",
    title: "Team Meeting Summary",
    content:
      "Conducted weekly team meeting. Discussed project timelines and resource allocation.",
    createdAt: new Date(2023, 4, 19),
    status: "in-review",
    employeeName: "John Doe",
  },
];

const Reports = () => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);
  const [isEditReportDialogOpen, setIsEditReportDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState<{
    title: string;
    content: string;
    status: "draft" | "in-review" | "completed";
  }>({
    title: "",
    content: "",
    status: "draft",
  });

  // Filter reports based on search query and status
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.employeeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleNewReportSubmit = () => {
    if (!newReport.title || !newReport.content) {
      enqueueSnackbar("Export deleted successfully", { variant: "success" });
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      title: newReport.title,
      content: newReport.content,
      createdAt: new Date(),
      status: newReport.status,
      employeeName: "Current User", // In a real app, this would be the logged-in user
    };

    setReports([report, ...reports]);
    setNewReport({ title: "", content: "", status: "draft" });
    setIsNewReportDialogOpen(false);

    enqueueSnackbar("Export deleted successfully", { variant: "success" });
  };

  const handleEditReport = (report: Report) => {
    setCurrentReport(report);
    setNewReport({
      title: report.title,
      content: report.content,
      status: report.status,
    });
    setIsEditReportDialogOpen(true);
  };

  const handleUpdateReport = () => {
    if (!currentReport) return;

    const updatedReports = reports.map((report) =>
      report.id === currentReport.id
        ? {
            ...report,
            title: newReport.title,
            content: newReport.content,
            status: newReport.status,
          }
        : report
    );

    setReports(updatedReports);
    setIsEditReportDialogOpen(false);
    setCurrentReport(null);
    setNewReport({ title: "", content: "", status: "draft" });

    enqueueSnackbar("Export deleted successfully", { variant: "success" });
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);
    enqueueSnackbar("Export deleted successfully", { variant: "success" });
  };

  const exportToPDF = () => {
    toast("Export Started");

    // In a real app, this would call a PDF generation service
    setTimeout(() => {
      enqueueSnackbar("Export Complete", { variant: "info" });
    }, 2000);
  };

  const exportToExcel = () => {
    toast("Export Started");

    // In a real app, this would call an Excel generation service
    setTimeout(() => {
      enqueueSnackbar("Export Complete", { variant: "info" });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Dialog
          open={isNewReportDialogOpen}
          onOpenChange={setIsNewReportDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Submit a new report about your daily activities.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  placeholder="Report title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newReport.content}
                  onChange={(e) =>
                    setNewReport({ ...newReport, content: e.target.value })
                  }
                  placeholder="Describe your activities..."
                  className="min-h-[150px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newReport.status}
                  onValueChange={(value: "draft" | "in-review" | "completed") =>
                    setNewReport({ ...newReport, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewReportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNewReportSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            View and manage all employee reports.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem
                    onClick={exportToPDF}
                    className="cursor-pointer"
                  >
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportToExcel}
                    className="cursor-pointer"
                  >
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No reports found. Create a new report to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>{report.employeeName}</TableCell>
                    <TableCell>
                      {format(report.createdAt, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : report.status === "in-review"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        }`}
                      >
                        {report.status === "in-review"
                          ? "In Review"
                          : report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {report.status !== "completed" ? (
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditReport(report)}
                            className="hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReport(report.id)}
                            className="hover:bg-destructive/90 hover:text-destructive-foreground"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No actions available
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Report Dialog */}
      <Dialog
        open={isEditReportDialogOpen}
        onOpenChange={setIsEditReportDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>Make changes to your report.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newReport.title}
                onChange={(e) =>
                  setNewReport({ ...newReport, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={newReport.content}
                onChange={(e) =>
                  setNewReport({ ...newReport, content: e.target.value })
                }
                className="min-h-[150px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={newReport.status}
                onValueChange={(value: "draft" | "in-review" | "completed") =>
                  setNewReport({ ...newReport, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditReportDialogOpen(false)}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateReport}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
