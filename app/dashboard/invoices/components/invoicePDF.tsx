import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Invoice } from "@/types";

// Font Registration
Font.register({
  family: "Helvetica",
  src: "https://fonts.gstatic.com/s/helvetica/v13/7cHpv4kjgoGqM7E_DMs5yng.ttf",
});
Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

// Currency formatting function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#2c3e50",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    borderBottom: "1 solid #f38633",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Oswald",
    color: "#f38633",
    fontWeight: "bold",
  },
  invoiceLabel: {
    fontSize: 16,
    fontFamily: "Oswald",
    color: "#2c3e50",
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#666666",
  },
  amountDueContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  amountDue: {
    backgroundColor: "#f38633",
    color: "white",
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
  },
  section: {
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#666666",
    fontSize: 9,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f38633",
    color: "white",
    padding: 6,
    fontSize: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #e0e0e0",
    padding: 6,
    backgroundColor: "#ffffff",
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  totalsBox: {
    width: 200,
    border: "1 solid #e0e0e0",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f8f9fa",
  },
  bankDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    fontSize: 8,
    color: "#666666",
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  logo: {
    width: 120,
    marginTop: 15,
    opacity: 0.9,
  },
  label: {
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
  },
  value: {
    color: "#666666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
});

// Invoice PDF Component
export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const formatDate = (date: Date) => date.toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>DJK International Limited</Text>
            <View style={styles.companyInfo}>
              <View>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>Dar es Salaam, Tanzania</Text>
                <Text style={styles.value}>info@djkinternational.co.tz</Text>
                <Text style={styles.value}>TIN: 135-514-888</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.label}>Issue Date</Text>
              <Text style={styles.value}>
                {formatDate(new Date(invoice.issueDate))}
              </Text>
              <Text style={styles.label}>Due Date</Text>
              <Text style={styles.value}>
                {formatDate(new Date(invoice.dueDate))}
              </Text>
            </View>
          </View>
        </View>

        {/* Amount Due */}
        <View style={styles.amountDueContainer}>
          <View style={styles.amountDue}>
            <Text style={{ fontWeight: "bold" }}>Amount Due:</Text>
            <Text style={{ fontWeight: "bold" }}>
              {formatCurrency(invoice.totalAmount || 100)}
            </Text>
          </View>
        </View>

        {/* Bill To / Ship To */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Bill To:</Text>
              <Text style={styles.value}>{invoice.client.name}</Text>
              <Text style={styles.value}>{invoice.client.streetAddress}</Text>
              <Text style={styles.value}>TIN: {invoice.client?.tin}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Ship To:</Text>
              <Text style={styles.value}>{`${invoice.client?.name}`}</Text>
              <Text
                style={styles.value}
              >{`${invoice.client.streetAddress}`}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={{ width: "5%", textAlign: "center" }}>#</Text>
            <Text style={{ width: "45%" }}>Item & Description</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>Qty</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>UoM</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>Price</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>Amount</Text>
          </View>
          {invoice.items.map((item: any, index: any) => (
            <View
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : {},
              ]}
              key={index}
            >
              <Text style={{ width: "5%", textAlign: "center" }}>
                {index + 1}
              </Text>
              <Text style={{ width: "45%" }}>{item.description}</Text>
              <Text style={{ width: "15%", textAlign: "center" }}>
                {item.quantity}
              </Text>
              <Text style={{ width: "15%", textAlign: "center" }}>{"EA"}</Text>
              <Text style={{ width: "15%", textAlign: "center" }}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={{ width: "15%", textAlign: "center" }}>
                {formatCurrency(item.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text style={styles.label}>Subtotal:</Text>
              <Text style={styles.value}>
                {formatCurrency(invoice.subtotal || 0)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text style={styles.label}>Total Taxable Value:</Text>
              <Text style={styles.value}>
                {formatCurrency(invoice.tax.amount || 0)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[styles.label, { fontSize: 12 }]}>TOTAL:</Text>
              <Text style={[styles.label, { fontSize: 12 }]}>
                {formatCurrency(invoice.totalAmount || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bank Details and Additional Info */}
        <View style={styles.bankDetails}>
          <View>
            <Text style={styles.label}>Bank Details</Text>
            <Text style={styles.value}>
              Account Holder: DJK International Ltd
            </Text>
            <Text style={styles.value}>Bank: Equity Bank</Text>
            <Text style={styles.value}>USD Acct: 3004211565589</Text>
            <Text style={styles.value}>TZS Acct: 3004211589540</Text>
          </View>
          <View>
            <Text style={styles.label}>Additional Information</Text>
            <Text style={styles.value}>Bill of Lading: BL001</Text>
            <Text style={styles.value}>Prepared by: Athanas Shauritanga</Text>
          </View>
        </View>

        {/* Logo */}
        <Image src="/djk_logo.png" style={styles.logo} />
      </Page>
    </Document>
  );
}
