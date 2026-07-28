import type { TransactionFormErrors } from "@/src/types/transactionForm";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import {
  getTransactionById,
  updateTransaction,
} from "@/src/services/transactions";
import type { TransactionType } from "@/src/types/transaction";
import { formatCurrency, parseCurrency } from "@/src/utils/currency";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

type UseEditTransactionParams = {
  id?: string;
};

export function useEditTransaction({ id }: UseEditTransactionParams) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  const [errors, setErrors] = useState<TransactionFormErrors>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showMessage = useCallback((messageTitle: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${messageTitle}\n\n${message}`);
      return;
    }

    Alert.alert(messageTitle, message);
  }, []);

  const loadTransaction = useCallback(async () => {
    if (!id) {
      showMessage("Erro", "O lançamento não foi encontrado.");

      router.back();
      return;
    }

    try {
      setLoading(true);

      const transaction = await getTransactionById(id);

      setTitle(transaction.title);
      setCategory(transaction.category);
      setType(transaction.type);
      setAmount(formatCurrency(transaction.amount));
    } catch (error) {
      console.error("Erro ao carregar lançamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível carregar o lançamento.",
      );

      showMessage("Erro", message);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, showMessage]);

  useEffect(() => {
    void loadTransaction();
  }, [loadTransaction]);

  function clearError(field: keyof TransactionFormErrors) {
    if (!errors[field]) {
      return;
    }

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function handleChangeTitle(value: string) {
    setTitle(value);
    clearError("title");
  }

  function handleChangeCategory(value: string) {
    setCategory(value);
    clearError("category");
  }

  function handleChangeAmount(value: string) {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setAmount("");
      clearError("amount");
      return;
    }

    const numericAmount = Number(digits) / 100;

    setAmount(formatCurrency(numericAmount));
    clearError("amount");
  }

  function validateForm(): boolean {
    const newErrors: TransactionFormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Informe o título.";
    }

    const numericAmount = parseCurrency(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Informe um valor válido.";
    }

    if (!category.trim()) {
      newErrors.category = "Informe a categoria.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!id || saving) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      await updateTransaction(id, {
        title: title.trim(),
        amount: parseCurrency(amount),
        category: category.trim(),
        type,
      });

      showMessage("Sucesso", "Lançamento atualizado com sucesso.");

      router.back();
    } catch (error) {
      console.error("Erro ao atualizar lançamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível atualizar o lançamento.",
      );

      showMessage("Erro", message);
    } finally {
      setSaving(false);
    }
  }

  return {
    title,
    amount,
    category,
    type,
    errors,
    loading,
    saving,

    setType,
    handleChangeTitle,
    handleChangeAmount,
    handleChangeCategory,
    handleSubmit,
  };
}
