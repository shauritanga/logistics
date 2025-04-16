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
import { IProformaInvoice } from "@/models/index";

// Register Helvetica font
Font.register({
  family: "Helvetica",
  src: "https://fonts.gstatic.com/s/helvetica/v13/7cHpv4kjgoGqM7E_DMs5yng.ttf",
});
Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
  },

  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },

  section: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    paddingHorizontal: 5,
  },
  repeatedText: {
    fontSize: 10,
    color: "#555",
  },
  amountDue: {
    width: "100%",
    backgroundColor: "#f38633",
    flex: 1,
  },
});

// Define the Invoice PDF component
export function InvoicePDF({ invoice }: { invoice: IProformaInvoice }) {
  return (
    <Document>
      <Page style={styles.body}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>DJK international Limited</Text>
          <Text>INVOICE</Text>
          <Text>PRF001</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginTop: 12,
          }}
        >
          <View style={{ flex: 1 }}></View>
          <View
            style={{
              flex: 1,
              color: "white",
              backgroundColor: "#f38633",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>Amount Due:</Text>
            <Text style={styles.text}>USD 100.00</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            fontSize: 11,
            color: "gray",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Dar es salaam,Dar es salaam,Tanzania</Text>
            <Text>info@djkinternational.co.tz</Text>
            <Text>TIN:135-514-888</Text>
            <Text>www.djkinternational.co.tz</Text>
            <Text>Contact Name: Joyce Dennis</Text>
          </View>
          <View style={{}}>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.text}>Issue Date</Text>
              <Text style={styles.text}>USD 100.00</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.text}>Due Date</Text>
              <Text style={styles.text}>USD 100.00</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginTop: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Bill To</Text>
            <Text>FNA,Mbezi beach, Kinondoni, dar es salaam</Text>
            <Text>TIN:163-222-356, VAT:40-2636646-W</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Ship To</Text>
            <Text>Samora Avenue, 7th floor, Dar es salaam, TZ</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              color: "white",
              fontSize: 12,
              backgroundColor: "#f38633",
            }}
          >
            <Text style={{ marginHorizontal: 5 }}>#</Text>
            <Text style={{ flex: 3, textAlign: "left", paddingHorizontal: 5 }}>
              Item & Description
            </Text>
            <Text style={{ flex: 1, textAlign: "center" }}>Qty</Text>
            <Text style={{ flex: 1, textAlign: "center" }}>UoM</Text>
            <Text style={{ flex: 1, textAlign: "center" }}>Price</Text>
            <Text style={{ flex: 1, textAlign: "center" }}>Amount</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",

                border: "0.5px solid gray",
                fontSize: 12,
              }}
            >
              <Text
                style={{ borderRight: "1px solid gray", marginHorizontal: 5 }}
              >
                {index + 1}
              </Text>
              <Text
                style={{
                  flex: 3,
                  borderRight: "1px solid gray",
                  textAlign: "left",
                  paddingHorizontal: 5,
                }}
              >
                {item.description}
              </Text>
              <Text
                style={{
                  flex: 1,
                  borderRight: "1px solid gray",
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </Text>
              <Text
                style={{
                  flex: 1,
                  borderRight: "1px solid gray",
                  textAlign: "center",
                }}
              >
                {}
              </Text>
              <Text
                style={{
                  flex: 1,
                  borderRight: "1px solid gray",
                  textAlign: "center",
                }}
              >
                {item.unitPrice}
              </Text>
              <Text style={{ flex: 1 }}>{item.total}</Text>
            </View>
          ))}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}></View>
          <View style={{ flex: 1, border: "1px solid grey" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Subtotal</Text>
              <Text>USD 100</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Total Taxable Value</Text>
              <Text>USD 100</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>TOTAL</Text>
              <Text>USD 100</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 18,
          }}
        >
          <View>
            <Text style={{ fontSize: 10 }}>
              ACCOUNT HOLDER NAME:DJK INTERNATIONAL LTD
            </Text>
            <Text style={{ fontSize: 10 }}>Bank name:EQUITY BANK</Text>
            <Text style={{ fontSize: 10 }}>
              Account Nummber:USD3004211565589 TZS 3004211589540
            </Text>
            <Text style={{ fontSize: 10 }}>Branch Name: GOLDEN JUBILEE</Text>
            <Text style={{ fontSize: 10 }}>IFSC Code: EQBLTZTZXXX</Text>
          </View>
          <View>
            <Text>BILL OF LANDING:BL001</Text>
            <Text>ATHANAS SHAURITANGA</Text>
            <Text>UKWAMANI, KAWE</Text>
          </View>
        </View>
        <Image src="/djk_logo.png" style={{ width: 150 }} />
      </Page>
    </Document>
  );
}
