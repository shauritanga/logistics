import mongoose, { Schema } from "mongoose";
const permissionSchema = new Schema({
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});
const roleSchema = new Schema({
  name: { type: String },
  permissions: {
    employees: permissionSchema,
    users: permissionSchema,
    transactions: permissionSchema,
    expenses: permissionSchema,
    invoices: permissionSchema,
    payments: permissionSchema,
    roles: permissionSchema,
  },
});

export default mongoose.models?.Role || mongoose.model("Role", roleSchema);
