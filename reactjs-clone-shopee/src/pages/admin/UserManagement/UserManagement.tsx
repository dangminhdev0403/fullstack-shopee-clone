import GenericTable from "@components/admin/GenericTable";
import { ColumnDef } from "@components/admin/GenericTable/GenericTable";

interface User {
  id: string;
  name: string;
  email: string;
}

const userColumns: ColumnDef<User>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Tên" },
  { key: "email", header: "Email" },
];

export default function UserManagement() {
  return (
    <GenericTable<User>
      columns={userColumns}
      data={[{ id: "1", name: "Nguyễn Văn A", email: "a@gmail.com" }]}
      page={1}
      totalPages={3}
      onPageChange={(p) => console.log("Change page:", p)}
      onSearch={(val) => console.log("Search:", val)}
      onEdit={(user) => console.log("Edit:", user)}
      onDelete={(user) => console.log("Delete:", user)}
    />
  );
}
