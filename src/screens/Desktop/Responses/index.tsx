import React from "react";
import { useStaffFormResponses } from "./useStaffFormResponses";
import Header from "./Header";
import TableView from "./TableView";
import ResponseDetailModal from "./Modals";

export function StaffFormResponses() {
  const hook = useStaffFormResponses();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        searchTerm={hook.searchTerm}
        setSearchTerm={hook.setSearchTerm}
        filterForm={hook.filterForm}
        setFilterForm={hook.setFilterForm}
        filterUser={hook.filterUser}
        setFilterUser={hook.setFilterUser}
        uniqueForms={hook.uniqueForms}
        uniqueUsers={hook.uniqueUsers}
      />
      <TableView
        loading={hook.loading}
        error={hook.error}
        filteredResponses={hook.filteredResponses}
        isAnalyst={hook.isAnalyst}
        setSelectedResponse={hook.setSelectedResponse}
        fetchResponses={hook.fetchResponses}
        handleDeleteClick={hook.handleDeleteClick}
        deleteDialogOpen={hook.deleteDialogOpen}
        setDeleteDialogOpen={hook.setDeleteDialogOpen}
        handleDeleteConfirm={hook.handleDeleteConfirm}
        deleting={hook.deleting}
        responseToDelete={hook.responseToDelete}
        formatDate={hook.formatDate}
      />

      {hook.selectedResponse && (
        <ResponseDetailModal
          response={hook.selectedResponse}
          onClose={() => hook.setSelectedResponse(null)}
        />
      )}
    </div>
  );
}

export default StaffFormResponses;
