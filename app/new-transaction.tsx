import { router } from "expo-router";

import { PageHeader } from "@/src/components/common/PageHeader";
import { ScreenContainer } from "@/src/components/common/ScreenContainer";
import { TransactionForm } from "@/src/components/Transactions/TransactionForm";
import { useNewTransaction } from "@/src/hooks/useNewTransaction";

export default function NewTransactionScreen() {
  const {
    type,
    title,
    amount,
    category,
    notes,
    errors,
    loading,
    availableCategories,
    setNotes,
    handleChangeTitle,
    handleChangeAmount,
    handleChangeCategory,
    handleChangeType,
    handleCreate,
  } = useNewTransaction();

  return (
    <ScreenContainer>
      <PageHeader
        title="Novo lançamento"
        subtitle="Cadastre uma nova receita ou despesa."
        onBack={() => router.back()}
      />

      <TransactionForm
        title={title}
        amount={amount}
        category={category}
        type={type}
        errors={errors}
        loading={loading}
        submitLabel="Salvar lançamento"
        loadingLabel="Salvando..."
        categories={availableCategories}
        notes={notes}
        showNotes
        useCategorySelector
        useTypeSelector
        onChangeTitle={handleChangeTitle}
        onChangeAmount={handleChangeAmount}
        onChangeCategory={handleChangeCategory}
        onChangeType={handleChangeType}
        onChangeNotes={setNotes}
        onSubmit={() => {
          void handleCreate();
        }}
        onCancel={() => router.back()}
      />
    </ScreenContainer>
  );
}

