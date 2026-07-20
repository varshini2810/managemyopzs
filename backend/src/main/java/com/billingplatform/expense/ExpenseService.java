package com.billingplatform.expense;

import com.billingplatform.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Expense getExpense(String id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    @Transactional
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Transactional
    public Expense updateExpense(String id, Expense expenseDetails) {
        Expense expense = getExpense(id);
        expense.setCategory(expenseDetails.getCategory());
        expense.setDescription(expenseDetails.getDescription());
        expense.setVendor(expenseDetails.getVendor());
        expense.setEmployee(expenseDetails.getEmployee());
        expense.setDepartment(expenseDetails.getDepartment());
        expense.setAmount(expenseDetails.getAmount());
        expense.setTax(expenseDetails.getTax());
        expense.setCurrency(expenseDetails.getCurrency());
        expense.setPaymentMethod(expenseDetails.getPaymentMethod());
        expense.setDate(expenseDetails.getDate());
        expense.setStatus(expenseDetails.getStatus());
        expense.setNotes(expenseDetails.getNotes());
        expense.setReceipt(expenseDetails.getReceipt());
        expense.setTags(expenseDetails.getTags());
        expense.setInvoiceNum(expenseDetails.getInvoiceNum());
        return expenseRepository.save(expense);
    }

    @Transactional
    public void deleteExpense(String id) {
        Expense expense = getExpense(id);
        expenseRepository.delete(expense);
    }
}
