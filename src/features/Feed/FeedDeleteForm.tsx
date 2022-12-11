import toast from "react-hot-toast";

import DeleteForm from "@/core/components/Table/DeleteForm";
import { useModalStore } from "@/core/stores/modalStore";
import { trpc } from "@/utils/trpc";

interface Props {
  id?: string;
}
const title = "Delete Entry";
const body = "Are you sure you want to delete the entry?";
const acceptActionText = "Delete";
const rejectActionText = "Cancel";
const successMessage = "Succesfully deleted the entry";
const errorMessage = "Error deleting the entry";

const FeedDeleteForm = ({ id }: Props) => {
  const { closeModal } = useModalStore();
  const utils = trpc.useContext();

  const { mutate } = trpc["feed"].delete.useMutation({
    onSuccess: () => {
      toast.success(successMessage)
      utils.feed.getAll.invalidate();
    },
    onError: () => {
      toast(errorMessage)
    },
    onSettled: () => {
      closeModal();
    },
  });

  const acceptAction = () => { id && typeof id === "number" && mutate({ id }) };

  return (
    <DeleteForm
      title={title}
      body={body}
      acceptActionText={acceptActionText}
      rejectActionText={rejectActionText}
      acceptAction={acceptAction}
    />
  );
};

export default FeedDeleteForm;
