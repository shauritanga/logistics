"use client";
import React, { useState, useEffect } from "react";
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
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { enqueueSnackbar } from "notistack";
import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from "@/actions/report";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Report {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  status: "draft" | "in-review" | "completed";
  employeeName: string;
}

export const dynamic = "force-dynamic";

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      enqueueSnackbar("Failed to fetch reports", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

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

  const handleNewReportSubmit = async () => {
    if (!newReport.title || !newReport.content) {
      enqueueSnackbar("Title and content are required", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      await createReport({
        ...newReport,
        employeeName: "Current User", // Replace with actual authenticated user
      });
      setNewReport({ title: "", content: "", status: "draft" });
      setIsNewReportDialogOpen(false);
      await fetchReports(); // Refresh reports
      enqueueSnackbar("Report created successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to create report", { variant: "error" });
    } finally {
      setLoading(false);
    }
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

  const handleUpdateReport = async () => {
    if (!currentReport) return;

    try {
      setLoading(true);
      await updateReport(currentReport._id, newReport);
      setIsEditReportDialogOpen(false);
      setCurrentReport(null);
      setNewReport({ title: "", content: "", status: "draft" });
      await fetchReports();
      enqueueSnackbar("Report updated successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to update report", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      setLoading(true);
      await deleteReport(id);
      await fetchReports();
      enqueueSnackbar("Report deleted successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to delete report", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // For exports, we'll keep client-side simulation since Server Actions can't return files directly
  const exportToPDF = () => {
    try {
      toast("Export Started");
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Reports", 105, 20, { align: "center" });

      // Define table columns and rows
      const tableColumn = ["Title", "Employee", "Date", "Status", "Content"];
      const tableRows = filteredReports.map((report) => [
        report.title,
        report.employeeName,
        format(new Date(report.createdAt), "MMM dd, yyyy"),
        report.status === "in-review"
          ? "In Review"
          : report.status.charAt(0).toUpperCase() + report.status.slice(1),
        report.content.substring(0, 50) +
          (report.content.length > 50 ? "..." : ""), // Truncate long content
      ]);

      // Use autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: {
          fontSize: 10,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [100, 100, 100], // Gray header background
          textColor: [255, 255, 255], // White text
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Title
          1: { cellWidth: 30 }, // Employee
          2: { cellWidth: 30 }, // Date
          3: { cellWidth: 25 }, // Status
          4: { cellWidth: 65 }, // Content
        },
        didDrawPage: (data: any) => {
          // Add page numbers
          const pageCount = doc.internal.pages;
          doc.setFontSize(10);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, 190, 285, {
            align: "right",
          });
        },
      });

      doc.save("reports.pdf");
      enqueueSnackbar("PDF Export Complete", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("PDF Export Failed", { variant: "error" });
    }
  };

  const exportToExcel = () => {
    try {
      toast("Export Started");
      const worksheetData = filteredReports.map((report) => ({
        Title: report.title,
        Employee: report.employeeName,
        Date: format(new Date(report.createdAt), "MMM dd, yyyy"),
        Status: report.status,
        Content: report.content,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

      // Add headers styling (optional)
      worksheet["!cols"] = [
        { wch: 30 }, // Title
        { wch: 20 }, // Employee
        { wch: 15 }, // Date
        { wch: 15 }, // Status
        { wch: 50 }, // Content
      ];

      XLSX.writeFile(workbook, "reports.xlsx");
      enqueueSnackbar("Excel Export Complete", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Excel Export Failed", { variant: "error" });
    }
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
            <Button disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Submit a new report about your activities.
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newReport.status}
                  onValueChange={(value: "draft" | "in-review" | "completed") =>
                    setNewReport({ ...newReport, status: value })
                  }
                  disabled={loading}
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleNewReportSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
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
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
                disabled={loading}
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
                  <Button variant="outline" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportToPDF}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No reports found. Create a new report to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>{report.employeeName}</TableCell>
                    <TableCell>
                      {format(new Date(report.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : report.status === "in-review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
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
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReport(report._id)}
                            disabled={loading}
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

      <Dialog
        open={isEditReportDialogOpen}
        onOpenChange={setIsEditReportDialogOpen}
      >
        <DialogContent>
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={newReport.status}
                onValueChange={(value: "draft" | "in-review" | "completed") =>
                  setNewReport({ ...newReport, status: value })
                }
                disabled={loading}
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateReport} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
