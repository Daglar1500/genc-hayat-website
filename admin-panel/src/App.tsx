import { useState, useEffect } from 'react';
import { FileText, X, Edit3 } from 'lucide-react';
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
import StatsView from './views/StatsView';

export default function App() {
    const data = useAdminData();
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('admin-dark') === 'true');
    useEffect(() => { localStorage.setItem('admin-dark', String(darkMode)); }, [darkMode]);

    const [logMinimized, setLogMinimized] = useState(false);
    const [logDirty, setLogDirty] = useState(false);
    const [logCloseConfirm, setLogCloseConfirm] = useState(false);
    useEffect(() => {
        if (data.view !== 'log') { setLogMinimized(false); setLogDirty(false); }
    }, [data.view]);

    const handleStartEdit = (article: import('./types').Article) => {
        setLogMinimized(false);
        setLogDirty(false);
        data.startEditArticle(article);
    };

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-200 flex${darkMode ? ' dark' : ''}`}>
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
                setPreviewArticle={data.setPreviewArticle}
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
                    darkMode={darkMode}
                    toggleDarkMode={() => setDarkMode(d => !d)}
                />

                <div className="space-y-16 max-w-7xl mx-auto pb-20">
                    {data.isLoading ? (
                        <div className="flex items-center justify-center py-32 text-gray-400">
                            <div className="text-center space-y-3">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <div className="text-sm font-medium">Yükleniyor...</div>
                            </div>
                        </div>
                    ) : (data.view === 'dashboard' || data.view === 'log' || data.view === 'read') ? (
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
                            startEditArticle={handleStartEdit}
                            setPreviewArticle={data.setPreviewArticle}
                            setSelectedArticle={data.setSelectedArticle}
                            setView={data.setView}
                            recordHistory={data.recordHistory}
                            updateSectionConfig={data.updateSectionConfig}
                            addConfigItem={data.addConfigItem}
                            removeConfigItem={data.removeConfigItem}
                            updateConfigItem={data.updateConfigItem}
                        />
                    ) : data.view === 'stats' ? (
                        <StatsView />
                    ) : data.view === 'issues' ? (
                        <IssuesView
                            issues={data.issues}
                            setIssues={data.setIssues}
                            selectedIssue={data.selectedIssue}
                            setSelectedIssue={data.setSelectedIssue}
                            issueFormOpen={data.issueFormOpen}
                            setIssueFormOpen={data.setIssueFormOpen}
                            loggedArticles={data.loggedArticles}
                            setLoggedArticles={data.setLoggedArticles}
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
                    editors={data.editors}
                    setLoggedArticles={data.setLoggedArticles}
                    setView={data.setView}
                    setSelectedArticle={data.setSelectedArticle}
                    setPreviewArticle={data.setPreviewArticle}
                    onMinimize={() => setLogMinimized(true)}
                    externalMinimized={logMinimized || !!data.activePreviewId}
                    onDirtyChange={setLogDirty}
                />
            )}
            {data.view === 'read' && data.selectedArticle && (
                <ReadView
                    selectedArticle={data.selectedArticle}
                    setView={data.setView}
                    setSelectedArticle={data.setSelectedArticle}
                />
            )}

            {/* Bottom tab bar — preview tabs + log article tab in one row */}
            {(data.previewTabs.length > 0 || data.view === 'log') && (
                <div className="fixed bottom-0 left-0 right-0 z-100 flex items-stretch bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg h-9">
                    {data.previewTabs.map(tab => {
                        const isActive = tab.id === data.activePreviewId;
                        return (
                            <div
                                key={tab.id}
                                className={`flex items-stretch border-r border-gray-200 dark:border-gray-700 max-w-55 min-w-0 ${isActive ? 'bg-blue-50 dark:bg-blue-950 border-t-2 border-t-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                <button
                                    onClick={() => data.setActivePreviewId(tab.id)}
                                    className="flex items-center gap-1.5 pl-3 pr-1 min-w-0 flex-1"
                                >
                                    <FileText size={12} className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                                    <span className={`truncate text-xs ${isActive ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>{tab.title}</span>
                                </button>
                                <button
                                    onClick={() => data.closePreviewTab(tab.id)}
                                    className="flex items-center px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
                                    title="Kapat"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        );
                    })}

                    {data.view === 'log' && (() => {
                        const isActive = !logMinimized && !data.activePreviewId;
                        return (
                        <div className={`flex items-stretch border-r border-gray-200 dark:border-gray-700 max-w-55 min-w-0 ${isActive ? 'bg-orange-50 dark:bg-orange-950 border-t-2 border-t-orange-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <button
                                onClick={() => {
                                    if (isActive) { setLogMinimized(true); }
                                    else { data.setActivePreviewId(null); setLogMinimized(false); }
                                }}
                                className="flex items-center gap-1.5 pl-3 pr-1 min-w-0 flex-1"
                            >
                                <Edit3 size={12} className={`shrink-0 ${isActive ? 'text-orange-500' : 'text-orange-400'}`} />
                                <span className={`truncate text-xs ${isActive ? 'text-orange-700 dark:text-orange-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {data.selectedArticle?.title || 'Yeni Makale'}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    if (logDirty) { setLogCloseConfirm(true); return; }
                                    data.setView('dashboard');
                                    data.setSelectedArticle(null);
                                }}
                                className="flex items-center px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
                                title="Kapat"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        );
                    })()}
                </div>
            )}

            {/* Active preview modal */}
            {(() => {
                const activeArticle = data.previewTabs.find(a => a.id === data.activePreviewId);
                return activeArticle ? (
                    <PreviewModal
                        article={activeArticle}
                        onClose={() => data.closePreviewTab(activeArticle.id)}
                        onMinimize={() => data.setActivePreviewId(null)}
                        onEdit={handleStartEdit}
                        getCategoryColor={data.getCategoryColor}
                    />
                ) : null;
            })()}

            <SettingsPanel
                settingsOpen={data.settingsOpen}
                setSettingsOpen={data.setSettingsOpen}
                categories={data.categories}
                labels={data.labels}
                editors={data.editors}
                addCategory={data.addCategory}
                deleteCategory={data.deleteCategory}
                addLabel={data.addLabel}
                deleteLabel={data.deleteLabel}
                addEditor={data.addEditor}
                deleteEditor={data.deleteEditor}
            />

            <Toast toasts={data.toasts} />

            {/* Close confirmation modal for dirty edit form */}
            {logCloseConfirm && (
                <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Kaydedilmemiş değişiklikler var</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Düzenleme formunu kapatmak istediğinizden emin misiniz? Kaydedilmemiş değişiklikler kaybolacak.</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setLogCloseConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => {
                                    setLogCloseConfirm(false);
                                    data.setView('dashboard');
                                    data.setSelectedArticle(null);
                                }}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                            >
                                Kaydetmeden Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
