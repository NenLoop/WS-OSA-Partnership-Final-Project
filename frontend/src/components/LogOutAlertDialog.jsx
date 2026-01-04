import { AlertDialog } from "radix-ui";
import { Trash2, LogOut } from "lucide-react";

export default function LogOutAlertDialog({ onLogout }) {
  return (
    <AlertDialog.Root>
      {/* Trigger */}
      <AlertDialog.Trigger asChild>
        <button className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
          <LogOut size={20} />
          <p className={`text-sm duration-300 ${!open && "hidden"}`}>Logout</p>
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-50" />

        <AlertDialog.Content
          className="
            fixed z-50
            top-1/2 left-1/2
            w-[90vw] max-w-sm
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-lg shadow p-6
          "
        >
          <AlertDialog.Title className="text-lg font-semibold">
            Log Out Account
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            Are you sure you want to log out
          </AlertDialog.Description>

          <div className="flex justify-end gap-2 mt-6">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 border rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                LogOut
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
