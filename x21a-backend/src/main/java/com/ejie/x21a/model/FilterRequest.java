package com.ejie.x21a.model;

public class FilterRequest<F> {
    private F filter;
    private int page;
    private int rows;
    private String sidx; 
    private String sord; 

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
}