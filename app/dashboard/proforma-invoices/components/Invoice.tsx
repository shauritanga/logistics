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
import { IProformaInvoice } from "@/models/ProformaInvoice";

// Font Registration
Font.register({
  family: "Helvetica",
  src: "https://fonts.gstatic.com/s/helvetica/v13/7cHpv4kjgoGqM7E_DMs5yng.ttf",
});
Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#333333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Oswald",
    color: "#f38633",
  },
  invoiceLabel: {
    fontSize: 16,
    fontFamily: "Oswald",
  },
  amountDueContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
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
    marginBottom: 15,
  },
  companyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#666666",
    fontSize: 11,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f38633",
    color: "white",
    padding: 5,
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #e0e0e0",
    padding: 5,
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  totalsBox: {
    width: 200,
    border: "1 solid #e0e0e0",
    padding: 8,
  },
  bankDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    fontSize: 10,
    color: "#666666",
  },
  logo: {
    width: 150,
    marginTop: 20,
  },
});

// Invoice PDF Component
export function InvoicePDF({ invoice }: { invoice: any }) {
  const formatDate = (date: Date) => date.toLocaleDateString();

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DJK International Limited</Text>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text>PRF001</Text>
          </View>
        </View>

        {/* Amount Due */}
        <View style={styles.amountDueContainer}>
          <View style={styles.amountDue}>
            <Text>Amount Due:</Text>
            <Text>USD {(invoice.estimatedTotal || 100).toFixed(2)}</Text>
          </View>
        </View>

        {/* Company and Date Info */}
        <View style={styles.companyInfo}>
          <View>
            <Text>Dar es Salaam, Dar es Salaam, Tanzania</Text>
            <Text>info@djkinternational.co.tz</Text>
            <Text>TIN: 135-514-888</Text>
            <Text>www.djkinternational.co.tz</Text>
            <Text>Contact: Joyce Dennis</Text>
          </View>
          <View>
            <Text>Issue Date: {formatDate(new Date(invoice.issueDate))}</Text>
            <Text>Due Date: {formatDate(new Date(invoice.expiryDate))}</Text>
          </View>
        </View>

        {/* Bill To / Ship To */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold" }}>Bill To:</Text>
              <Text>FNA, Mbezi Beach, Kinondoni</Text>
              <Text>Dar es Salaam, Tanzania</Text>
              <Text>TIN: 163-222-356</Text>
              <Text>VAT: 40-2636646-W</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold" }}>Ship To:</Text>
              <Text>{`${invoice.bol?.consignee?.name},${invoice.bol?.consignee?.country}`}</Text>
              <Text>Dar es Salaam, Tanzania</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={{ width: "5%" }}>#</Text>
            <Text style={{ width: "45%" }}>Item & Description</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>Qty</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>UoM</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>Price</Text>
            <Text style={{ width: "15%", textAlign: "center" }}>Amount</Text>
          </View>
          {invoice.items.map((item: any, index: any) => (
            <View style={styles.tableRow} key={index}>
              <Text style={{ width: "5%" }}>{index + 1}</Text>
              <Text style={{ width: "45%" }}>{item.description}</Text>
              <Text style={{ width: "15%", textAlign: "center" }}>
                {item.quantity}
              </Text>
              <Text style={{ width: "15%", textAlign: "center" }}>{"EA"}</Text>
              <Text style={{ width: "15%", textAlign: "center" }}>
                {item.unitPrice.toFixed(2)}
              </Text>
              <Text style={{ width: "15%", textAlign: "center" }}>
                {item.total.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Subtotal:</Text>
              <Text>USD {invoice.estimatedSubtotal?.toFixed(2)}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Total Taxable Value:</Text>
              <Text>USD {invoice.tax.amount}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>TOTAL:</Text>
              <Text style={{ fontWeight: "bold" }}>
                USD {invoice.estimatedTotal?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bank Details and Additional Info */}
        <View style={styles.bankDetails}>
          <View>
            <Text>Account Holder: DJK International Ltd</Text>
            <Text>Bank: Equity Bank</Text>
            <Text>USD Acct: 3004211565589</Text>
            <Text>TZS Acct: 3004211589540</Text>
            <Text>Branch: Golden Jubilee</Text>
            <Text>SWIFT: EQBLTZTZXXX</Text>
          </View>
          <View>
            <Text>Bill of Lading: BL001</Text>
            <Text>Prepared by: Athanas Shauritanga</Text>
            <Text>Location: Ukwamani, Kawe</Text>
          </View>
        </View>

        {/* Logo */}
        <Image src="/djk_logo.png" style={styles.logo} />
      </Page>
    </Document>
  );
}
