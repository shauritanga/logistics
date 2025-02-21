import { readTransactions } from "@/actions/transactions";
import TransactionTable from "./components/TransactionTable";

const TransactionsTable = async () => {
  const transactions = await readTransactions();

  return (
    <div className="overflow-x-auto">
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default TransactionsTable;
