import {
    Dialog, DialogContent, DialogDescription, DialogHeader,
    DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationLogoutProps {
    isLogoutDialogOpen: boolean;
    setIsLogoutDialogOpen: (value: boolean) => void;
    confirmLogout: () => void;
}

export default function ConfirmationLogout({ isLogoutDialogOpen, setIsLogoutDialogOpen, confirmLogout }: ConfirmationLogoutProps) {
    return (
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to logout from the Mazao ERP Admin Portal?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={confirmLogout}>
                        Logout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}