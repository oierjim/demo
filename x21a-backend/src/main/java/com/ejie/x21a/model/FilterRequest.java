package com.ejie.x21a.model;

import java.util.List;

public class FilterRequest<F> {
    private F filter;
    private int page;
    private int rows;
    private String sidx; 
    private String sord; 
    
    // Campos para Selección Global y Operaciones Masivas
    private boolean selectAll;
    private List<String> selectedIds;
    private List<String> deselectedIds;

    public F getFilter() { return filter; }
    public void setFilter(F filter) { this.filter = filter; }
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    public int getRows() { return rows; }
    public void setRows(int rows) { this.rows = rows; }
    public String getSidx() { return sidx; }
    public void setSidx(String sidx) { this.sidx = sidx; }
    public String getSord() { return sord; }
    public void setSord(String sord) { this.sord = sord; }
    
    public boolean isSelectAll() { return selectAll; }
    public void setSelectAll(boolean selectAll) { this.selectAll = selectAll; }
    public List<String> getSelectedIds() { return selectedIds; }
    public void setSelectedIds(List<String> selectedIds) { this.selectedIds = selectedIds; }
    public List<String> getDeselectedIds() { return deselectedIds; }
    public void setDeselectedIds(List<String> deselectedIds) { this.deselectedIds = deselectedIds; }
}