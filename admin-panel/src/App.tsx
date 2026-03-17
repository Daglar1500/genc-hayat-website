import { useAdminData } from './hooks/useAdminData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import Toast from './components/Toast';
import PreviewModal from './components/PreviewModal';
import DashboardView from './views/DashboardView';
import LogView from './views/LogView';
import ReadView from './views/ReadView';
import IssuesView from './views/IssuesView';

export default function App() {
    const data = useAdminData();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex">
            <Sidebar
                menuOpen={data.menuOpen}
                setMenuOpen={data.setMenuOpen}
                sidebarSearch={data.sidebarSearch}
                setSidebarSearch={data.setSidebarSearch}
                sidebarSort={data.sidebarSort}
                setSidebarSort={data.setSidebarSort}
                loggedArticles={data.loggedArticles}
                sections={data.sections}
                bulkSelected={data.bulkSelected}
                setBulkSelected={data.setBulkSelected}
                bulkDropdownOpen={data.bulkDropdownOpen}
                setBulkDropdownOpen={data.setBulkDropdownOpen}
                handleDragStart={data.handleDragStart}
                deleteArticle={data.deleteArticle}
                getCategoryColor={data.getCategoryColor}
                formatLogDate={data.formatLogDate}
                recordHistory={data.recordHistory}
                setSections={data.setSections}
                showToast={data.showToast}
            />

            <div className={`flex-1 transition-all duration-300 p-8 ${data.menuOpen ? 'ml-80' : ''}`}>
                <Header
                    view={data.view}
                    setView={data.setView}
                    menuOpen={data.menuOpen}
                    setMenuOpen={data.setMenuOpen}
                    historySize={data.historySize}
                    futureSize={data.futureSize}
                    undoSections={data.undoSections}
                    redoSections={data.redoSections}
                    isSaving={data.isSaving}
                    saveLayout={data.saveLayout}
                    setSettingsOpen={data.setSettingsOpen}
                    setSelectedArticle={data.setSelectedArticle}
                    showTemplates={data.showTemplates}
                    setShowTemplates={data.setShowTemplates}
                    templates={data.templates}
                    loadTemplate={data.loadTemplate}
                    deleteTemplate={data.deleteTemplate}
                    saveTemplate={data.saveTemplate}
                />

                <div className="space-y-16 max-w-7xl mx-auto pb-20">
                    {data.isLoading ? (
                        <div className="flex items-center justify-center py-32 text-gray-400">
                            <div className="text-center space-y-3">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <div className="text-sm font-medium">Yükleniyor...</div>
                            </div>
                        </div>
                    ) : data.view === 'dashboard' ? (
                        <DashboardView
                            sections={data.sections}
                            setSections={data.setSections}
                            loggedArticles={data.loggedArticles}
                            categories={data.categories}
                            issues={data.issues}
                            pagination={data.pagination}
                            setPagination={data.setPagination}
                            getCategoryColor={data.getCategoryColor}
                            handleDragStart={data.handleDragStart}
                            handleDrop={data.handleDrop}
                            deleteArticleFromSection={data.deleteArticleFromSection}
                            startEditArticle={data.startEditArticle}
                            setPreviewArticle={data.setPreviewArticle}
                            setSelectedArticle={data.setSelectedArticle}
                            setView={data.setView}
                            recordHistory={data.recordHistory}
                            updateSectionConfig={data.updateSectionConfig}
                            addConfigItem={data.addConfigItem}
                            removeConfigItem={data.removeConfigItem}
                            updateConfigItem={data.updateConfigItem}
                        />
                    ) : data.view === 'issues' ? (
                        <IssuesView
                            issues={data.issues}
                            setIssues={data.setIssues}
                            selectedIssue={data.selectedIssue}
                            setSelectedIssue={data.setSelectedIssue}
                            issueFormOpen={data.issueFormOpen}
                            setIssueFormOpen={data.setIssueFormOpen}
                            loggedArticles={data.loggedArticles}
                        />
                    ) : null}
                </div>
            </div>

            {/* Modals */}
            {data.view === 'log' && (
                <LogView
                    selectedArticle={data.selectedArticle}
                    categories={data.categories}
                    labels={data.labels}
                    setLoggedArticles={data.setLoggedArticles}
                    setView={data.setView}
                    setSelectedArticle={data.setSelectedArticle}
                />
            )}
            {data.view === 'read' && data.selectedArticle && (
                <ReadView
                    selectedArticle={data.selectedArticle}
                    setView={data.setView}
                />
            )}

            {/* Article Quick Preview Modal */}
            {data.previewArticle && (
                <PreviewModal
                    article={data.previewArticle}
                    onClose={() => data.setPreviewArticle(null)}
                    onEdit={data.startEditArticle}
                    getCategoryColor={data.getCategoryColor}
                />
            )}

            <SettingsPanel
                settingsOpen={data.settingsOpen}
                setSettingsOpen={data.setSettingsOpen}
                categories={data.categories}
                labels={data.labels}
                addCategory={data.addCategory}
                deleteCategory={data.deleteCategory}
                addLabel={data.addLabel}
                deleteLabel={data.deleteLabel}
            />

            <Toast toasts={data.toasts} />
        </div>
    );
}
