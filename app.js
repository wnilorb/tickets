/* ==========================================================================
   LÓGICA DA APLICAÇÃO - TICKET BATCH PRINTING
   ========================================================================== */

// CONSTANTES E CONFIGURAÇÕES PADRÃO
const DEFAULT_VISIBLE_FIELDS = {
    nota: true,
    date: true,
    time: true,
    pesoBruto: true,
    pesoTara: true,
    liquido: true,
    toneladas: true,
    volume: true,
    cliente: true,
    material: true,
    tipoVenda: true,
    transportador: true,
    placa: true,
    motorista: true,
    destino: true,
    distrito: true,
    complemento: true,
    pedido: true,
    usuario: true,
    assinaturaUsuario: true,
    assinaturaMotorista: true
};

const DEFAULT_CONFIG = {
    companyName: 'IZA CONSTRUCOES E COMERCIO LTDA-USINA',
    companyCnpj: '84.479.351',
    companyAddress: 'AVENIDA TORQUATO TAPAJOS, 12850',
    companyPhone: 'MANAUS - AM - Tel: (92)3238-3545',
    defaultUser: 'RISONEIDE FERREIRA',
    autoIncrement: true,
    printLayout: '2x2',
    visibleFields: { ...DEFAULT_VISIBLE_FIELDS }
};

const COLUMN_MAPPING = {
    nota: ['nota', 'nota entrega', 'nota de entrega', 'num nota', 'numero nota', 'nº nota', 'n° nota', 'documento', 'nfe'],
    date: ['data', 'data saida', 'data de saida', 'data emissao', 'emissao', 'dia'],
    time: ['hora', 'hora saida', 'hora de saida', 'horario'],
    pesoBruto: ['peso bruto', 'bruto', 'peso bruto (kg)', 'peso_bruto', 'bruto (kg)', 'pesobruto'],
    pesoTara: ['tara', 'peso tara', 'peso tara (kg)', 'peso_tara', 'tara (kg)', 'pesotara'],
    volume: ['volume', 'vol', 'volume (m3)', 'volume (m³)', 'm3', 'm³'],
    cliente: ['cliente', 'nome cliente', 'destinatario', 'razao social'],
    material: ['material', 'produto', 'descricao', 'item'],
    tipoVenda: ['tipo venda', 'tipo de venda', 'venda', 'tipo_venda', 'operacao'],
    transportador: ['transportador', 'transportadora', 'empresa transporte'],
    placa: ['placa', 'veiculo', 'placa veiculo'],
    motorista: ['motorista', 'nome motorista', 'condutor'],
    destino: ['destino', 'cidade', 'local entrega'],
    distrito: ['distrito', 'bairro', 'regiao', 'localidade', 'subdistrito'],
    complemento: ['complemento', 'observacao', 'obs'],
    pedido: ['pedido', 'num pedido', 'numero pedido', 'nº pedido'],
    usuario: ['usuario', 'operador', 'emissor']
};

const DEFAULT_AUTOCOMPLETE_DB = {
    cliente: [
        "465 - PREFEITURA MUNICIPIO DE MANAUS",
        "1200 - TAPA BURACO",
        "108 - CONSTRUTORA ALFA LTDA"
    ],
    material: [
        "1274 - CONCRETO BETUMINOSO USINADO A QUENTE (CBUQ - 0B)",
        "1102 - EMULSAO ASFALTICA RR-2C"
    ],
    tipoVenda: [
        "FECHAMENTO SEMANAL POR LOTE",
        "VENDA A VISTA"
    ],
    transportador: [
        "465 - PREFEITURA MUNICIPIO DE MANAUS",
        "1200 - TAPA BURACO",
        "312 - TRANS-RAPIDO MANAUS",
        "108 - CONSTRUTORA ALFA LTDA"
    ],
    placa: [
        "TRZ4D97",
        "QZQ9H42",
        "QZO6B23",
        "JXY4H82",
        "PHO8A12",
        "NOY5C44"
    ],
    motorista: [
        "JOSE DA SILVA",
        "ANTONIO PEREIRA",
        "MARCOS DOS SANTOS",
        "CARLOS OLIVEIRA"
    ],
    destino: [
        "MANAUS / AM PREFEITURA MUNICIPIO DE MANAUS - AM",
        "MANAUS / AM TAPA BURACO",
        "MANAUS / AM - DISTRITO INDUSTRIAL"
    ],
    distrito: [
        "DISTRITO INDUSTRIAL",
        "CENTRO",
        "ZONA LESTE"
    ],
    complemento: [
        "USINA ASFALTO PREFEITURA DE MANAUS NOVO ISRAEL",
        "USINA ASFALTO TAPA BURACO",
        "USINA ASFALTO PREFEITURA DE MANAUS DDC",
        "OBRA RUA NOVE"
    ],
    pedido: [
        "57",
        "58",
        "59",
        "122"
    ]
};

const SAMPLE_TICKETS = [
    {
        id: 'sample-1',
        nota: 3821,
        date: '2026-06-01',
        time: '09:54',
        pesoBruto: 29170,
        pesoTara: 9390,
        volume: 8.24,
        cliente: '465 - PREFEITURA MUNICIPIO DE MANAUS',
        material: '1274 - CONCRETO BETUMINOSO USINADO A QUENTE (CBUQ - 0B)',
        tipoVenda: 'FECHAMENTO SEMANAL POR LOTE',
        transportador: '465 - PREFEITURA MUNICIPIO DE MANAUS',
        placa: 'QZO6B23',
        motorista: 'JOSE DA SILVA',
        destino: 'MANAUS / AM PREFEITURA MUNICIPIO DE MANAUS - AM',
        distrito: 'CENTRO',
        complemento: 'USINA ASFALTO PREFEITURA DE MANAUS DDC',
        pedido: '57',
        usuario: 'RISONEIDE FERREIRA'
    },
    {
        id: 'sample-2',
        nota: 3822,
        date: '2026-06-01',
        time: '10:15',
        pesoBruto: 31250,
        pesoTara: 9410,
        volume: 9.10,
        cliente: '465 - PREFEITURA MUNICIPIO DE MANAUS',
        material: '1274 - CONCRETO BETUMINOSO USINADO A QUENTE (CBUQ - 0B)',
        tipoVenda: 'FECHAMENTO SEMANAL POR LOTE',
        transportador: '465 - PREFEITURA MUNICIPIO DE MANAUS',
        placa: 'JXY4H82',
        motorista: 'ANTONIO PEREIRA',
        destino: 'MANAUS / AM PREFEITURA MUNICIPIO DE MANAUS - AM',
        distrito: 'CENTRO',
        complemento: 'USINA ASFALTO PREFEITURA DE MANAUS DDC',
        pedido: '58',
        usuario: 'RISONEIDE FERREIRA'
    },
    {
        id: 'sample-3',
        nota: 3823,
        date: '2026-06-01',
        time: '10:45',
        pesoBruto: 28400,
        pesoTara: 9350,
        volume: 7.94,
        cliente: '108 - CONSTRUTORA ALFA LTDA',
        material: '1102 - EMULSAO ASFALTICA RR-2C',
        tipoVenda: 'VENDA A VISTA',
        transportador: '108 - CONSTRUTORA ALFA LTDA',
        placa: 'PHO8A12',
        motorista: 'MARCOS DOS SANTOS',
        destino: 'MANAUS / AM - DISTRITO INDUSTRIAL',
        distrito: 'DISTRITO INDUSTRIAL',
        complemento: 'OBRA RUA NOVE',
        pedido: '122',
        usuario: 'RISONEIDE FERREIRA'
    },
    {
        id: 'sample-4',
        nota: 3824,
        date: '2026-06-01',
        time: '11:20',
        pesoBruto: 30500,
        pesoTara: 9380,
        volume: 8.80,
        cliente: '465 - PREFEITURA MUNICIPIO DE MANAUS',
        material: '1274 - CONCRETO BETUMINOSO USINADO A QUENTE (CBUQ - 0B)',
        tipoVenda: 'FECHAMENTO SEMANAL POR LOTE',
        transportador: '312 - TRANS-RAPIDO MANAUS',
        placa: 'NOY5C44',
        motorista: 'CARLOS OLIVEIRA',
        destino: 'MANAUS / AM PREFEITURA MUNICIPIO DE MANAUS - AM',
        distrito: 'ZONA LESTE',
        complemento: 'USINA ASFALTO PREFEITURA DE MANAUS DDC',
        pedido: '59',
        usuario: 'RISONEIDE FERREIRA'
    }
];

// ESTADO GLOBAL
let state = {
    tickets: [],
    config: { ...DEFAULT_CONFIG }
};

// SELETORES DOM
const dom = {
    companyName: document.getElementById('cfg-company-name'),
    companyCnpj: document.getElementById('cfg-company-cnpj'),
    companyAddress: document.getElementById('cfg-company-address'),
    companyPhone: document.getElementById('cfg-company-phone'),
    defaultUser: document.getElementById('cfg-default-user'),
    autoIncrement: document.getElementById('cfg-auto-increment'),
    printLayout: document.getElementById('cfg-print-layout'),
    
    statTotalTickets: document.getElementById('stat-total-tickets'),
    statTotalPages: document.getElementById('stat-total-pages'),
    statTotalWeight: document.getElementById('stat-total-weight'),
    
    btnExample: document.getElementById('btn-example'),
    btnClear: document.getElementById('btn-clear'),
    btnExport: document.getElementById('btn-export'),
    btnImportTrigger: document.getElementById('btn-import-trigger'),
    btnImport: document.getElementById('btn-import'),
    btnImportSheetTrigger: document.getElementById('btn-import-sheet-trigger'),
    btnImportSheet: document.getElementById('btn-import-sheet'),
    btnPrint: document.getElementById('btn-print'),
    
    btnAddTicket: document.getElementById('btn-add-ticket'),
    btnFirstTicket: document.getElementById('btn-add-first-ticket'),
    
    tbody: document.getElementById('tickets-tbody'),
    emptyState: document.getElementById('table-empty-state'),
    previewContainer: document.getElementById('preview-pages-container'),
    printArea: document.getElementById('print-area'),
    dropdownToggle: document.querySelector('.dropdown-toggle'),
    dropdownContent: document.querySelector('.dropdown-content'),
    btnFieldsConfig: document.getElementById('btn-fields-config'),
    fieldsModal: document.getElementById('fields-modal'),
    modalBtnClose: document.getElementById('modal-btn-close'),
    modalBtnSave: document.getElementById('modal-btn-save'),
    modalBtnRestore: document.getElementById('modal-btn-restore'),
    modalBtnSelectAll: document.getElementById('modal-btn-select-all'),
    modalBtnDeselectAll: document.getElementById('modal-btn-deselect-all')
};

// FORMATADORES AUXILIARES
function formatWeightKG(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return '0';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatTons(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// INICIALIZAÇÃO
function init() {
    // 1. Verificar autenticação
    const isAuthenticated = sessionStorage.getItem('ticket_auth') === 'true';
    if (!isAuthenticated) {
        showLoginScreen();
        return;
    }

    // Se autenticado, mostrar o app e esconder o login
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');

    // Atualizar badge do usuário logado
    const username = sessionStorage.getItem('ticket_user') || 'usuário';
    document.getElementById('active-user-name').innerText = username;

    // Configurar listener do logout
    document.getElementById('btn-logout').onclick = handleLogout;

    // Carregar configurações do localStorage se existirem
    const savedConfig = localStorage.getItem('ticket_config');
    if (savedConfig) {
        state.config = JSON.parse(savedConfig);
        // Garantir que todos os campos de visibleFields existam (evita problemas com backups antigos)
        state.config.visibleFields = {
            ...DEFAULT_VISIBLE_FIELDS,
            ...(state.config.visibleFields || {})
        };
    } else {
        state.config = {
            ...DEFAULT_CONFIG,
            visibleFields: { ...DEFAULT_VISIBLE_FIELDS }
        };
    }
    
    // Aplicar a visibilidade de campos baseada na config
    applyFieldVisibility();
    
    // Carregar tickets do localStorage se existirem
    const savedTickets = localStorage.getItem('ticket_list');
    if (savedTickets) {
        state.tickets = JSON.parse(savedTickets);
    }
    
    // Atualizar UI das configurações com o estado
    dom.companyName.value = state.config.companyName;
    dom.companyCnpj.value = state.config.companyCnpj;
    dom.companyAddress.value = state.config.companyAddress;
    dom.companyPhone.value = state.config.companyPhone;
    dom.defaultUser.value = state.config.defaultUser;
    dom.autoIncrement.checked = state.config.autoIncrement;
    if (dom.printLayout) dom.printLayout.value = state.config.printLayout || '2x2';
    
    // Configurar Event Listeners Globais
    setupGlobalListeners();
    
    // Renderizar
    renderAll();
}

// CONFIGURAÇÃO DOS EVENTOS GLOBAIS
function setupGlobalListeners() {
    // Configurações Globais
    const configInputs = [dom.companyName, dom.companyCnpj, dom.companyAddress, dom.companyPhone, dom.defaultUser];
    configInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const key = e.target.id.replace('cfg-', '').replace(/-([a-z])/g, g => g[1].toUpperCase());
            state.config[key] = e.target.value;
            saveConfig();
            renderPreviewAndPrint(); // Atualiza os previews instantaneamente
        });
    });
    
    dom.autoIncrement.addEventListener('change', (e) => {
        state.config.autoIncrement = e.target.checked;
        saveConfig();
    });
    
    if (dom.printLayout) {
        dom.printLayout.addEventListener('change', (e) => {
            state.config.printLayout = e.target.value;
            saveConfig();
            renderPreviewAndPrint();
            updateStats();
        });
    }

    // Botões de Ações
    dom.btnExample.addEventListener('click', loadSampleData);
    dom.btnClear.addEventListener('click', clearAllTickets);
    dom.btnExport.addEventListener('click', exportBackup);
    dom.btnImportTrigger.addEventListener('click', () => dom.btnImport.click());
    dom.btnImport.addEventListener('change', importBackup);
    
    dom.btnImportSheetTrigger.addEventListener('click', () => dom.btnImportSheet.click());
    dom.btnImportSheet.addEventListener('change', handleImportSheet);
    
    // Abrir/Fechar dropdown "Dados" ao clicar
    if (dom.dropdownToggle && dom.dropdownContent) {
        dom.dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita fechar imediatamente ao disparar clique no document
            dom.dropdownContent.classList.toggle('show');
        });
        
        // Fechar se clicar fora do dropdown
        document.addEventListener('click', (e) => {
            if (!dom.dropdownToggle.contains(e.target) && !dom.dropdownContent.contains(e.target)) {
                dom.dropdownContent.classList.remove('show');
            }
        });

        // Fechar ao clicar em qualquer item dentro do dropdown
        dom.dropdownContent.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                dom.dropdownContent.classList.remove('show');
            });
        });
    }
    
    dom.btnPrint.addEventListener('click', () => window.print());
    
    dom.btnAddTicket.addEventListener('click', () => addNewTicket());
    dom.btnFirstTicket.addEventListener('click', () => addNewTicket());
    
    // Eventos do Modal de Configuração de Campos
    if (dom.btnFieldsConfig) {
        dom.btnFieldsConfig.addEventListener('click', openFieldsModal);
    }
    if (dom.modalBtnClose) {
        dom.modalBtnClose.addEventListener('click', closeFieldsModal);
    }
    if (dom.modalBtnSave) {
        dom.modalBtnSave.addEventListener('click', saveFieldsConfig);
    }
    if (dom.modalBtnRestore) {
        dom.modalBtnRestore.addEventListener('click', restoreFieldsDefaults);
    }
    if (dom.modalBtnSelectAll) {
        dom.modalBtnSelectAll.addEventListener('click', selectAllFields);
    }
    if (dom.modalBtnDeselectAll) {
        dom.modalBtnDeselectAll.addEventListener('click', deselectAllFields);
    }
    if (dom.fieldsModal) {
        dom.fieldsModal.addEventListener('click', (e) => {
            if (e.target === dom.fieldsModal) {
                closeFieldsModal();
            }
        });
    }
    
    // Atalho de teclado ESC para fechar o modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dom.fieldsModal && !dom.fieldsModal.classList.contains('hidden')) {
            closeFieldsModal();
        }
    });

    // Prevenir envio acidental de formulários (caso existam)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault();
            // Focar no próximo input da linha ou criar nova se estiver na última
            focusNextInput(e.target);
        }
    });
}

// SALVAR NO LOCALSTORAGE
function saveConfig() {
    localStorage.setItem('ticket_config', JSON.stringify(state.config));
}

function saveTickets() {
    localStorage.setItem('ticket_list', JSON.stringify(state.tickets));
}

// ADICIONAR NOVO TICKET
function addNewTicket(data = null) {
    let newTicket;
    
    if (data) {
        newTicket = { ...data, id: Date.now() + Math.random().toString(36).substring(2, 5) };
    } else {
        // Obter número da nota automaticamente
        let nextNota = 3821;
        if (state.config.autoIncrement && state.tickets.length > 0) {
            const lastNota = Math.max(...state.tickets.map(t => parseInt(t.nota) || 0));
            if (lastNota > 0) {
                nextNota = lastNota + 1;
            }
        }
        
        // Obter data/hora atual
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        
        newTicket = {
            id: Date.now() + Math.random().toString(36).substring(2, 5),
            nota: nextNota,
            date: `${yyyy}-${mm}-${dd}`,
            time: `${hh}:${min}`,
            pesoBruto: '',
            pesoTara: '',
            volume: '',
            cliente: '',
            material: '',
            tipoVenda: '',
            transportador: '',
            placa: '',
            motorista: '',
            destino: '',
            distrito: '',
            complemento: '',
            pedido: '',
            usuario: state.config.defaultUser
        };
    }
    
    state.tickets.push(newTicket);
    saveTickets();
    
    renderTable();
    renderPreviewAndPrint();
    updateStats();
    
    // Rolar a tabela para o final e focar no novo ticket
    setTimeout(() => {
        const rows = dom.tbody.querySelectorAll('tr');
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            lastRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // Foca no campo nota do novo ticket
            const notaInput = lastRow.querySelector('input[type="number"]');
            if (notaInput) notaInput.focus();
        }
    }, 100);
}

// DELETAR TICKET
function deleteTicket(id) {
    state.tickets = state.tickets.filter(t => t.id !== id);
    saveTickets();
    renderTable();
    renderPreviewAndPrint();
    updateStats();
}

// DUPLICAR TICKET
function duplicateTicket(id) {
    const origin = state.tickets.find(t => t.id === id);
    if (!origin) return;
    
    let nextNota = 3821;
    if (state.config.autoIncrement) {
        const lastNota = Math.max(...state.tickets.map(t => parseInt(t.nota) || 0));
        if (lastNota > 0) {
            nextNota = lastNota + 1;
        }
    } else {
        nextNota = (parseInt(origin.nota) || 0) + 1;
    }
    
    // Calcular nova data e hora com incremento aleatório de 12 a 15 minutos
    let nextDate = origin.date;
    let nextTime = origin.time;
    
    if (origin.date && origin.time) {
        const randomMinutes = Math.floor(Math.random() * (15 - 12 + 1)) + 12; // 12, 13, 14, ou 15
        const [year, month, day] = origin.date.split('-').map(Number);
        const [hours, minutes] = origin.time.split(':').map(Number);
        
        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hours) && !isNaN(minutes)) {
            const dateObj = new Date(year, month - 1, day, hours, minutes);
            dateObj.setMinutes(dateObj.getMinutes() + randomMinutes);
            
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const hh = String(dateObj.getHours()).padStart(2, '0');
            const min = String(dateObj.getMinutes()).padStart(2, '0');
            
            nextDate = `${yyyy}-${mm}-${dd}`;
            nextTime = `${hh}:${min}`;
        }
    }
    
    const clone = {
        ...origin,
        id: Date.now() + Math.random().toString(36).substring(2, 5),
        nota: nextNota,
        date: nextDate,
        time: nextTime
    };
    
    // Inserir clone logo após o original
    const idx = state.tickets.findIndex(t => t.id === id);
    state.tickets.splice(idx + 1, 0, clone);
    
    saveTickets();
    renderTable();
    renderPreviewAndPrint();
    updateStats();
}

// LIMPAR TODOS OS TICKETS
function clearAllTickets() {
    if (state.tickets.length === 0) {
        alert('Não há tickets no lote para limpar.');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir TODOS os tickets deste lote? Esta ação não pode ser desfeita.')) {
        state.tickets = [];
        saveTickets();
        renderTable();
        renderPreviewAndPrint();
        updateStats();
    }
}

// CARREGAR DADOS DE EXEMPLO
function loadSampleData() {
    if (state.tickets.length > 0) {
        if (!confirm('Deseja substituir seus tickets atuais pelos dados de exemplo?')) {
            return;
        }
    }
    
    state.tickets = JSON.parse(JSON.stringify(SAMPLE_TICKETS));
    saveTickets();
    renderTable();
    renderPreviewAndPrint();
    updateStats();
}

// EXPORTAR BACKUP JSON
function exportBackup() {
    if (state.tickets.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }
    
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_tickets_${dateStr}.json`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// IMPORTAR BACKUP JSON
function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const imported = JSON.parse(evt.target.result);
            
            if (imported.tickets && Array.isArray(imported.tickets)) {
                state.tickets = imported.tickets;
                if (imported.config) {
                    state.config = { ...state.config, ...imported.config };
                    
                    // Atualizar inputs globais
                    dom.companyName.value = state.config.companyName;
                    dom.companyCnpj.value = state.config.companyCnpj;
                    dom.companyAddress.value = state.config.companyAddress;
                    dom.companyPhone.value = state.config.companyPhone;
                    dom.defaultUser.value = state.config.defaultUser;
                    dom.autoIncrement.checked = state.config.autoIncrement;
                    if (dom.printLayout) dom.printLayout.value = state.config.printLayout || '2x2';
                    
                    saveConfig();
                }
                
                saveTickets();
                renderAll();
                alert(`Lote com ${state.tickets.length} tickets importado com sucesso!`);
            } else {
                alert('Arquivo inválido. Formato incompatível.');
            }
        } catch (err) {
            alert('Erro ao ler arquivo. Certifique-se de que é um backup JSON válido.');
        }
    };
    reader.readAsText(file);
    // Limpar o valor do input file para permitir importar o mesmo arquivo novamente se necessário
    dom.btnImport.value = '';
}

// IMPORTAR DADOS DE PLANILHA (Excel/CSV)
function handleImportSheet(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
            
            // Obter a primeira planilha
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            
            // Converter planilha para array de objetos JSON (primeira linha = cabeçalhos)
            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            
            if (rawRows.length === 0) {
                alert('Nenhum dado encontrado na planilha.');
                return;
            }
            
            // Confirmar com o usuário a importação
            if (confirm(`Foram encontrados ${rawRows.length} registros na planilha.\n\nDeseja ADICIONAR esses registros ao lote atual de tickets?\n(Para substituir o lote atual, clique em 'Cancelar', exclua os tickets atuais pelo botão 'Limpar Tudo' e importe a planilha novamente.)`)) {
                // Adicionar ao lote existente
                const newTickets = rawRows.map(row => mapRowToTicket(row));
                state.tickets = state.tickets.concat(newTickets);
                
                saveTickets();
                renderAll();
                alert(`${newTickets.length} tickets importados e adicionados com sucesso!`);
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao ler a planilha. Certifique-se de carregar um arquivo Excel (.xlsx, .xls) ou CSV válido.');
        }
    };
    reader.readAsArrayBuffer(file);
    // Limpar o valor do input file para permitir re-importar se necessário
    dom.btnImportSheet.value = '';
}

// MAPEAR LINHA DA PLANILHA PARA ESTRUTURA DO TICKET (USANDO SINÔNIMOS)
function mapRowToTicket(row) {
    const ticket = {
        id: Date.now() + Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5),
        nota: '',
        date: '',
        time: '',
        pesoBruto: '',
        pesoTara: '',
        volume: '',
        cliente: '',
        material: '',
        tipoVenda: '',
        transportador: '',
        placa: '',
        motorista: '',
        destino: '',
        distrito: '',
        complemento: '',
        pedido: '',
        usuario: state.config.defaultUser || ''
    };

    // Para cada campo do ticket, encontrar se existe alguma coluna correspondente na linha
    for (const [field, synonyms] of Object.entries(COLUMN_MAPPING)) {
        const matchedKey = Object.keys(row).find(key => {
            const normalizedKey = key.toLowerCase().trim()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
                .replace(/[^a-z0-9]/g, ''); // remove espaços e caracteres especiais
                
            return synonyms.some(syn => {
                const normalizedSyn = syn.toLowerCase().trim()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]/g, '');
                return normalizedKey === normalizedSyn;
            });
        });

        if (matchedKey !== undefined) {
            let val = row[matchedKey];
            
            // Sanitização de dados de acordo com o tipo do campo
            if (field === 'nota' || field === 'pesoBruto' || field === 'pesoTara') {
                val = val === '' ? '' : parseInt(val);
                if (isNaN(val)) val = '';
            } else if (field === 'volume') {
                val = val === '' ? '' : parseFloat(val);
                if (isNaN(val)) val = '';
            } else if (field === 'date') {
                val = formatExcelDate(val);
            } else if (field === 'time') {
                val = formatExcelTime(val);
            } else {
                val = (val === null || val === undefined) ? '' : String(val).trim();
            }
            
            ticket[field] = val;
        }
    }
    
    // Se o peso bruto e tara foram importados, recalcular líquido/volume
    const bruto = parseInt(ticket.pesoBruto) || 0;
    const tara = parseInt(ticket.pesoTara) || 0;
    if (bruto > 0 && tara > 0) {
        const liquido = Math.max(0, bruto - tara);
        if (!ticket.volume) {
            const volume = liquido > 0 ? (liquido / 2400) : 0;
            ticket.volume = volume > 0 ? parseFloat(volume.toFixed(4)) : '';
        }
    }

    return ticket;
}

// FORMATAR DATA EXCEL PARA YYYY-MM-DD
function formatExcelDate(val) {
    if (!val) return '';
    
    if (val instanceof Date) {
        const yyyy = val.getFullYear();
        const mm = String(val.getMonth() + 1).padStart(2, '0');
        const dd = String(val.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    
    // Se for string
    if (typeof val === 'string') {
        val = val.trim();
        // Verificar formato brasileiro DD/MM/AAAA ou DD-MM-AAAA
        const brDateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
        const match = val.match(brDateRegex);
        if (match) {
            return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        }
        // Verificar formato ISO YYYY-MM-DD
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (isoDateRegex.test(val)) return val;
    }
    
    return '';
}

// FORMATAR HORA EXCEL PARA HH:MM
function formatExcelTime(val) {
    if (val === null || val === undefined || val === '') return '';
    
    if (val instanceof Date) {
        const hh = String(val.getHours()).padStart(2, '0');
        const min = String(val.getMinutes()).padStart(2, '0');
        return `${hh}:${min}`;
    }
    
    if (typeof val === 'string') {
        val = val.trim();
        // Se for hh:mm
        const hhMmRegex = /^(\d{1,2}):(\d{2})$/;
        if (hhMmRegex.test(val)) {
            const parts = val.split(':');
            return `${parts[0].padStart(2, '0')}:${parts[1]}`;
        }
        // Se for hh:mm:ss
        const hhMmSsRegex = /^(\d{1,2}):(\d{2}):(\d{2})$/;
        const match = val.match(hhMmSsRegex);
        if (match) return `${match[1].padStart(2, '0')}:${match[2]}`;
    }
    
    if (typeof val === 'number') {
        // Tratar fração decimal do dia (ex: 0.5 = 12:00)
        const totalMinutes = Math.round(val * 24 * 60);
        const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
        const min = String(totalMinutes % 60).padStart(2, '0');
        return `${hh}:${min}`;
    }
    
    return '';
}

// ATUALIZAR UM CAMPO ESPECÍFICO DE UM TICKET SEM RE-RENDERIZAR A TABELA
function updateTicketValue(id, field, value) {
    const ticket = state.tickets.find(t => t.id === id);
    if (!ticket) return;
    
    // Tratamento de tipos
    if (field === 'nota' || field === 'pesoBruto' || field === 'pesoTara') {
        ticket[field] = value === '' ? '' : parseInt(value);
    } else if (field === 'volume') {
        ticket[field] = value === '' ? '' : parseFloat(value);
    } else {
        ticket[field] = value;
    }
    
    // Se alterou peso, recalcula automaticamente líquido, toneladas e volume (densidade CBUQ = 2.4 t/m³)
    if (field === 'pesoBruto' || field === 'pesoTara') {
        const pesoBruto = parseInt(ticket.pesoBruto) || 0;
        const pesoTara = parseInt(ticket.pesoTara) || 0;
        const liquido = Math.max(0, pesoBruto - pesoTara);
        const toneladas = liquido / 1000;
        const volume = liquido > 0 ? (liquido / 2400) : 0;
        
        ticket.volume = volume > 0 ? parseFloat(volume.toFixed(4)) : '';
        
        // Atualiza na tela (linha específica da tabela)
        const row = dom.tbody.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            const inputLiquido = row.querySelector('.col-liquido');
            const inputToneladas = row.querySelector('.col-toneladas');
            const inputVolume = row.querySelector('.col-volume');
            
            if (inputLiquido) inputLiquido.value = liquido > 0 || ticket.pesoBruto !== '' ? formatWeightKG(liquido) : '';
            if (inputToneladas) inputToneladas.value = toneladas > 0 || ticket.pesoBruto !== '' ? formatTons(toneladas) : '';
            if (inputVolume) inputVolume.value = volume > 0 ? formatVolume(volume) : '';
        }
    }
    
    saveTickets();
    updateStats();
    
    // Otimização para Lotes Grandes: Atualizar apenas o ticket específico na tela ao invés de re-renderizar todas as páginas
    const previewTicket = dom.previewContainer.querySelector(`.ticket-wrapper[data-id="${id}"]`);
    const printTicket = dom.printArea.querySelector(`.ticket-wrapper[data-id="${id}"]`);
    const newTicketHTML = generateTicketHTML(ticket);
    
    if (previewTicket) previewTicket.outerHTML = newTicketHTML;
    if (printTicket) printTicket.outerHTML = newTicketHTML;
}

// SISTEMA DE FOCO INTELIGENTE
function focusNextInput(currentInput) {
    const row = currentInput.closest('tr');
    const inputs = Array.from(row.querySelectorAll('input:not(.table-input-readonly)'));
    const index = inputs.indexOf(currentInput);
    
    if (index >= 0 && index < inputs.length - 1) {
        // Vai para o próximo input da mesma linha
        inputs[index + 1].focus();
    } else {
        // Fim da linha: tenta ir para a primeira célula do próximo ticket
        const nextRow = row.nextElementSibling;
        if (nextRow) {
            const nextRowInputs = nextRow.querySelectorAll('input:not(.table-input-readonly)');
            if (nextRowInputs.length > 0) nextRowInputs[0].focus();
        } else {
            // Se for o último ticket, adiciona um novo automaticamente!
            addNewTicket();
        }
    }
}

// RENDERIZAR TABELA DE EDIÇÃO (Apenas quando a lista muda estruturalmente)
function renderTable() {
    if (state.tickets.length === 0) {
        dom.emptyState.style.display = 'flex';
        dom.tbody.innerHTML = '';
        return;
    }
    
    dom.emptyState.style.display = 'none';
    
    let html = '';
    state.tickets.forEach(t => {
        const pesoBruto = parseInt(t.pesoBruto) || 0;
        const pesoTara = parseInt(t.pesoTara) || 0;
        const liquido = Math.max(0, pesoBruto - pesoTara);
        const toneladas = liquido / 1000;
        
        html += `
            <tr data-id="${t.id}">
                <td>
                    <div class="row-actions">
                        <button class="btn-row btn-row-duplicate" onclick="duplicateTicket('${t.id}')" title="Duplicar Linha">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                        <button class="btn-row btn-row-delete" onclick="deleteTicket('${t.id}')" title="Excluir Linha">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
                <td class="col-nota">
                    <input type="number" class="table-input" value="${t.nota}" oninput="updateTicketValue('${t.id}', 'nota', this.value)">
                </td>
                <td class="col-date">
                    <input type="date" class="table-input" value="${t.date}" oninput="updateTicketValue('${t.id}', 'date', this.value)">
                </td>
                <td class="col-time">
                    <input type="time" class="table-input" value="${t.time}" oninput="updateTicketValue('${t.id}', 'time', this.value)">
                </td>
                <td class="col-pesoBruto">
                    <input type="number" class="table-input" value="${t.pesoBruto}" placeholder="0" oninput="updateTicketValue('${t.id}', 'pesoBruto', this.value)">
                </td>
                <td class="col-pesoTara">
                    <input type="number" class="table-input" value="${t.pesoTara}" placeholder="0" oninput="updateTicketValue('${t.id}', 'pesoTara', this.value)">
                </td>
                <td class="col-liquido">
                    <input type="text" class="table-input table-input-readonly col-liquido" value="${formatWeightKG(liquido)}" readonly tabindex="-1">
                </td>
                <td class="col-toneladas">
                    <input type="text" class="table-input table-input-readonly col-toneladas" value="${formatTons(toneladas)}" readonly tabindex="-1">
                </td>
                <td class="col-volume">
                    <input type="text" class="table-input table-input-readonly col-volume" value="${t.volume !== '' ? formatVolume(t.volume) : ''}" readonly tabindex="-1">
                </td>
                <td class="col-cliente">
                    <input type="text" class="table-input" list="dl-cliente" value="${t.cliente}" placeholder="Cliente" oninput="updateTicketValue('${t.id}', 'cliente', this.value)" onblur="learnAutocompleteValue('cliente', this.value)">
                </td>
                <td class="col-material">
                    <input type="text" class="table-input" list="dl-material" value="${t.material}" placeholder="Material" oninput="updateTicketValue('${t.id}', 'material', this.value)" onblur="learnAutocompleteValue('material', this.value)">
                </td>
                <td class="col-tipoVenda">
                    <input type="text" class="table-input" list="dl-tipoVenda" value="${t.tipoVenda}" placeholder="Tipo de Venda" oninput="updateTicketValue('${t.id}', 'tipoVenda', this.value)" onblur="learnAutocompleteValue('tipoVenda', this.value)">
                </td>
                <td class="col-transportador">
                    <input type="text" class="table-input" list="dl-transportador" value="${t.transportador}" placeholder="Transportador" oninput="updateTicketValue('${t.id}', 'transportador', this.value)" onblur="learnAutocompleteValue('transportador', this.value)">
                </td>
                <td class="col-placa">
                    <input type="text" class="table-input" list="dl-placa" value="${t.placa}" placeholder="Placa" oninput="updateTicketValue('${t.id}', 'placa', this.value)" onblur="learnAutocompleteValue('placa', this.value)">
                </td>
                <td class="col-motorista">
                    <input type="text" class="table-input" list="dl-motorista" value="${t.motorista || ''}" placeholder="Motorista" oninput="updateTicketValue('${t.id}', 'motorista', this.value)" onblur="learnAutocompleteValue('motorista', this.value)">
                </td>
                <td class="col-destino">
                    <input type="text" class="table-input" list="dl-destino" value="${t.destino}" placeholder="Destino" oninput="updateTicketValue('${t.id}', 'destino', this.value)" onblur="learnAutocompleteValue('destino', this.value)">
                </td>
                <td class="col-distrito">
                    <input type="text" class="table-input" list="dl-distrito" value="${t.distrito || ''}" placeholder="Distrito" oninput="updateTicketValue('${t.id}', 'distrito', this.value)" onblur="learnAutocompleteValue('distrito', this.value)">
                </td>
                <td class="col-complemento">
                    <input type="text" class="table-input" list="dl-complemento" value="${t.complemento}" placeholder="Complemento" oninput="updateTicketValue('${t.id}', 'complemento', this.value)" onblur="learnAutocompleteValue('complemento', this.value)">
                </td>
                <td class="col-pedido">
                    <input type="text" class="table-input" list="dl-pedido" value="${t.pedido || ''}" placeholder="Pedido" oninput="updateTicketValue('${t.id}', 'pedido', this.value)" onblur="learnAutocompleteValue('pedido', this.value)">
                </td>
                <td class="col-usuario">
                    <input type="text" class="table-input" value="${t.usuario}" placeholder="Usuário" oninput="updateTicketValue('${t.id}', 'usuario', this.value)">
                </td>
            </tr>
        `;
    });
    
    dom.tbody.innerHTML = html;
}

// ATUALIZAR ESTATÍSTICAS
function updateStats() {
    const total = state.tickets.length;
    if (dom.statTotalTickets) dom.statTotalTickets.innerText = total;
    
    const isLayout2 = state.config.printLayout === '1x2';
    const ticketsPerPage = isLayout2 ? 2 : 4;
    const pages = Math.ceil(total / ticketsPerPage);
    if (dom.statTotalPages) dom.statTotalPages.innerText = pages;
    
    let totalWeight = 0;
    state.tickets.forEach(t => {
        const pb = parseInt(t.pesoBruto) || 0;
        const pt = parseInt(t.pesoTara) || 0;
        totalWeight += Math.max(0, pb - pt);
    });
    
    if (dom.statTotalWeight) dom.statTotalWeight.innerText = formatWeightKG(totalWeight) + ' kg';
}

// ENCAPSULAR CÓDIGO HTML DO TICKET INDIVIDUAL
function generateTicketHTML(ticket) {
    if (!ticket) {
        // Ticket vazio (quadrante em branco com divisória pontilhada fina na visualização)
        return `<div class="ticket-wrapper empty-quadrant"></div>`;
    }
    
    const pb = parseInt(ticket.pesoBruto) || 0;
    const pt = parseInt(ticket.pesoTara) || 0;
    const liq = Math.max(0, pb - pt);
    const ton = liq / 1000;
    const visibleFields = state.config.visibleFields || DEFAULT_VISIBLE_FIELDS;
    
    // Lógica dinâmica de exibição de Data e Hora
    const dateFormatted = visibleFields.date ? formatDateBR(ticket.date) : '';
    const timeFormatted = visibleFields.time ? ticket.time : '';
    let dateTimeStr = '';
    
    if (dateFormatted && timeFormatted) {
        dateTimeStr = `<span class="date-val">${dateFormatted}</span><span class="date-separator"> - </span><span class="time-val">${timeFormatted}</span>`;
    } else if (dateFormatted) {
        dateTimeStr = `<span class="date-val">${dateFormatted}</span>`;
    } else if (timeFormatted) {
        dateTimeStr = `<span class="time-val">${timeFormatted}</span>`;
    }

    // Complemento & Pedido
    let complementoHtml = '';
    const showComplemento = visibleFields.complemento;
    const showPedido = visibleFields.pedido;
    if (showComplemento && ticket.complemento) {
        complementoHtml += escapeHTML(ticket.complemento);
    }
    if (showPedido && ticket.pedido) {
        if (complementoHtml) complementoHtml += '\n';
        complementoHtml += `Pedido: ${escapeHTML(ticket.pedido)}`;
    }
    const hasComplementoOrPedidoClass = (showComplemento && ticket.complemento) || (showPedido && ticket.pedido) ? 'has-pedido' : '';

    return `
        <div class="ticket-wrapper" data-id="${ticket.id || ''}">
            <div class="ticket-header">
                <div class="ticket-header-title">
                    <span>NOTA DE ENTREGA</span>
                    <span>${ticket.nota || ''}</span>
                </div>
                <div class="ticket-company-details">
                    <div class="ticket-company-name">${state.config.companyName}${state.config.companyCnpj ? '- ' + state.config.companyCnpj : ''}</div>
                    <div>${state.config.companyAddress}</div>
                    <div>${state.config.companyPhone}</div>
                </div>
                <div class="ticket-header-separator"></div>
            </div>
            
            <div class="ticket-body">
                <div class="ticket-row ticket-date-time-row">
                    <span class="ticket-label">Data da Saída</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${dateTimeStr}</span>
                </div>
                <div class="ticket-row ticket-peso-bruto-row">
                    <span class="ticket-label">Peso Bruto (KG)</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.pesoBruto !== '' ? formatWeightKG(ticket.pesoBruto) : ''}</span>
                </div>
                <div class="ticket-row ticket-peso-tara-row">
                    <span class="ticket-label">Peso Tara (KG)</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.pesoTara !== '' ? formatWeightKG(ticket.pesoTara) : ''}</span>
                </div>
                
                <div class="ticket-row ticket-row-weight ticket-liquido-row">
                    <span class="ticket-label">Líquido (KG)</span>
                    <span class="ticket-colon">:</span>
                    <div class="ticket-weight-value-container">
                        <span class="ticket-weight-liquid">${liq > 0 || ticket.pesoBruto !== '' ? formatWeightKG(liq) : ''}</span>
                        <span class="ticket-weight-tons">T: ${ton > 0 || ticket.pesoBruto !== '' ? formatTons(ton) : ''}</span>
                    </div>
                </div>
                
                <div class="ticket-row ticket-volume-row">
                    <span class="ticket-label">Volume (M3)</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.volume !== '' ? formatVolume(ticket.volume) : ''}</span>
                </div>
                <div class="ticket-row ticket-cliente-row">
                    <span class="ticket-label">Cliente</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.cliente || ''}</span>
                </div>
                <div class="ticket-row ticket-material-row">
                    <span class="ticket-label">Material</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.material || ''}</span>
                </div>
                <div class="ticket-row ticket-tipoVenda-row">
                    <span class="ticket-label">Tipo de Venda</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.tipoVenda || ''}</span>
                </div>
                <div class="ticket-row ticket-transportador-row">
                    <span class="ticket-label">Transportador</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.transportador || ''}</span>
                </div>
                <div class="ticket-row ticket-placa-row">
                    <span class="ticket-label">Placa</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.placa || ''}</span>
                </div>
                <div class="ticket-row ticket-motorista-row">
                    <span class="ticket-label">Motorista</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.motorista || ''}</span>
                </div>
                <div class="ticket-row ticket-destino-row">
                    <span class="ticket-label">Destino</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.destino || ''}</span>
                </div>
                <div class="ticket-row ticket-distrito-row">
                    <span class="ticket-label">Distrito</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${ticket.distrito || ''}</span>
                </div>
                <div class="ticket-row ticket-complemento-row ${hasComplementoOrPedidoClass}">
                    <span class="ticket-label">Complemento</span>
                    <span class="ticket-colon">:</span>
                    <span class="ticket-value">${complementoHtml}</span>
                </div>
            </div>
            
            <div class="ticket-footer">
                <div class="signature-line-wrapper signature-usuario-wrapper">
                    <div class="signature-line"></div>
                    <div class="signature-name">${ticket.usuario || state.config.defaultUser}</div>
                </div>
                <div class="signature-line-wrapper signature-motorista-wrapper">
                    <div class="signature-line"></div>
                    <div class="signature-name">${ticket.motorista || 'MOTORISTA'}</div>
                </div>
            </div>
        </div>
    `;
}

// RENDERIZAR PRÉ-VISUALIZAÇÃO EM TEMPO REAL E ÁREA DE IMPRESSÃO
function renderPreviewAndPrint() {
    const tickets = state.tickets;
    const totalTickets = tickets.length;
    
    if (totalTickets === 0) {
        dom.previewContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; text-align: center; margin-top: 40px;"><i class="fa-solid fa-eye-slash" style="font-size:32px; margin-bottom:8px; display:block;"></i>Adicione tickets para ver a pré-visualização.</div>';
        dom.printArea.innerHTML = '';
        return;
    }
    
    const isLayout2 = state.config.printLayout === '1x2';
    
    // Atualizar badge do título
    const badge = document.getElementById('preview-layout-badge');
    if (badge) {
        badge.innerText = isLayout2 ? '(1x2)' : '(2x2)';
    }
    
    const ticketsPerPage = isLayout2 ? 2 : 4;
    const numPages = Math.ceil(totalTickets / ticketsPerPage);
    let previewHTML = '';
    let printHTML = '';
    
    for (let p = 0; p < numPages; p++) {
        const startIndex = p * ticketsPerPage;
        
        if (isLayout2) {
            const t1 = tickets[startIndex] || null;
            const t2 = tickets[startIndex + 1] || null;
            
            previewHTML += `
                <div class="a4-page-preview layout-1x2">
                    ${generateTicketHTML(t1)}
                    ${generateTicketHTML(t2)}
                </div>
            `;
            
            printHTML += `
                <div class="a4-page layout-1x2">
                    ${generateTicketHTML(t1)}
                    ${generateTicketHTML(t2)}
                </div>
            `;
        } else {
            const t1 = tickets[startIndex] || null;
            const t2 = tickets[startIndex + 1] || null;
            const t3 = tickets[startIndex + 2] || null;
            const t4 = tickets[startIndex + 3] || null;
            
            previewHTML += `
                <div class="a4-page-preview">
                    ${generateTicketHTML(t1)}
                    ${generateTicketHTML(t2)}
                    ${generateTicketHTML(t3)}
                    ${generateTicketHTML(t4)}
                </div>
            `;
            
            printHTML += `
                <div class="a4-page">
                    ${generateTicketHTML(t1)}
                    ${generateTicketHTML(t2)}
                    ${generateTicketHTML(t3)}
                    ${generateTicketHTML(t4)}
                </div>
            `;
        }
    }
    
    dom.previewContainer.innerHTML = previewHTML;
    dom.printArea.innerHTML = printHTML;
}

// RENDERIZA TUDO
function renderAll() {
    renderTable();
    renderPreviewAndPrint();
    updateStats();
    updateAutocompleteDatabase();
}

// CONTROLE DE AUTENTICAÇÃO
function showLoginScreen() {
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const loginBtn = document.getElementById('btn-login');
    const errorMsg = document.getElementById('login-error');
    
    usernameInput.focus();
    
    // Configurar ações de login
    loginBtn.onclick = handleLogin;
    
    usernameInput.onkeydown = (e) => {
        if (e.key === 'Enter') passwordInput.focus();
    };
    
    passwordInput.onkeydown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };
}

function handleLogin() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.getElementById('login-error');
    const card = document.querySelector('.login-card');
    
    const user = usernameInput.value.trim().toLowerCase();
    const pass = passwordInput.value;
    
    // Verificar banco de dados (USERS_DATABASE carregado via users.js)
    if (typeof USERS_DATABASE !== 'undefined' && USERS_DATABASE[user] && USERS_DATABASE[user] === pass) {
        // Sucesso
        sessionStorage.setItem('ticket_auth', 'true');
        sessionStorage.setItem('ticket_user', user);
        
        // Configurar o Usuário Padrão da Assinatura para o usuário logado em UPPERCASE
        const savedConfig = localStorage.getItem('ticket_config');
        let currentConfig = { ...DEFAULT_CONFIG };
        if (savedConfig) {
            currentConfig = JSON.parse(savedConfig);
        }
        currentConfig.defaultUser = user.toUpperCase();
        localStorage.setItem('ticket_config', JSON.stringify(currentConfig));
        state.config = currentConfig;
        
        // Esconder tela de login e inicializar o aplicativo
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        
        init();
    } else {
        // Erro
        errorMsg.style.display = 'flex';
        card.classList.add('shake');
        passwordInput.value = '';
        passwordInput.focus();
        
        setTimeout(() => {
            card.classList.remove('shake');
        }, 400);
    }
}

function handleLogout() {
    sessionStorage.clear();
    window.location.reload();
}

// ESCAPAR CARACTERES HTML ESPECIAIS
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// FILTRAR LIXOS E PREFIXOS DO HISTÓRICO DE AUTOCOMPLETAR
function cleanupAutocompleteDB(db) {
    const fields = Object.keys(db);
    fields.forEach(field => {
        if (!Array.isArray(db[field])) {
            db[field] = [];
            return;
        }
        // Remove duplicados e valores vazios
        let uniqueVals = [...new Set(db[field].map(v => (v || '').trim()).filter(Boolean))];
        
        // Heurística de prefixo: remove itens curtos (digitação parcial) que sejam prefixos de termos mais longos
        uniqueVals = uniqueVals.filter(val => {
            const isGarbage = uniqueVals.some(otherVal => 
                otherVal !== val && 
                otherVal.startsWith(val) && 
                (val.length < 6 || otherVal.length - val.length > 2)
            );
            return !isGarbage;
        });
        
        db[field] = uniqueVals;
    });
    return db;
}

// ATUALIZAR E PERSISTIR HISTÓRICO DE AUTOCOMPLETAR (Carregamento / Carga em lote)
function updateAutocompleteDatabase() {
    const saved = localStorage.getItem('ticket_autocomplete_db');
    let db = saved ? JSON.parse(saved) : { ...DEFAULT_AUTOCOMPLETE_DB };

    const fields = ['cliente', 'material', 'tipoVenda', 'transportador', 'placa', 'motorista', 'destino', 'distrito', 'complemento', 'pedido'];
    fields.forEach(f => {
        if (!db[f]) db[f] = [];
    });

    let updated = false;

    state.tickets.forEach(ticket => {
        fields.forEach(field => {
            const val = (ticket[field] || '').trim();
            if (val && !db[field].includes(val)) {
                db[field].push(val);
                updated = true;
            }
        });
    });

    // Sempre executar limpeza automática
    db = cleanupAutocompleteDB(db);

    if (updated || !saved) {
        localStorage.setItem('ticket_autocomplete_db', JSON.stringify(db));
    }
    
    renderDatalists(db);
}

// APRENDER NOVO VALOR PARA AUTOCOMPLETAR (Disparado quando o input perde o foco - blur)
function learnAutocompleteValue(field, value) {
    const val = (value || '').trim();
    if (!val) return;
    
    const autocompleteFields = ['cliente', 'material', 'tipoVenda', 'transportador', 'placa', 'motorista', 'destino', 'distrito', 'complemento', 'pedido'];
    if (!autocompleteFields.includes(field)) return;
    
    const saved = localStorage.getItem('ticket_autocomplete_db');
    let db = saved ? JSON.parse(saved) : { ...DEFAULT_AUTOCOMPLETE_DB };
    
    autocompleteFields.forEach(f => {
        if (!db[f]) db[f] = [];
    });
    
    // Se o valor já existe, não precisamos alterar nada
    if (db[field].includes(val)) return;
    
    // Adicionar e limpar lixos residuais
    db[field].push(val);
    db = cleanupAutocompleteDB(db);
    
    localStorage.setItem('ticket_autocomplete_db', JSON.stringify(db));
    renderDatalists(db);
}

// RENDERIZAR OPÇÕES NAS DATALISTS
function renderDatalists(db) {
    const fields = ['cliente', 'material', 'tipoVenda', 'transportador', 'placa', 'motorista', 'destino', 'distrito', 'complemento', 'pedido'];
    fields.forEach(field => {
        const dl = document.getElementById(`dl-${field}`);
        if (dl) {
            // Ordenar alfabeticamente para melhor experiência do usuário
            const sortedVals = [...db[field]].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
            dl.innerHTML = sortedVals.map(val => `<option value="${escapeHTML(val)}"></option>`).join('');
        }
    });
}

// APLICAR CLASSES DE VISIBILIDADE AO BODY
function applyFieldVisibility() {
    const visibleFields = state.config.visibleFields || DEFAULT_VISIBLE_FIELDS;
    Object.keys(visibleFields).forEach(field => {
        const isVisible = visibleFields[field];
        if (isVisible) {
            document.body.classList.remove(`hide-field-${field}`);
        } else {
            document.body.classList.add(`hide-field-${field}`);
        }
    });
}

// CONTROLE DO MODAL DE CONFIGURAÇÃO DE CAMPOS
function openFieldsModal() {
    if (!dom.fieldsModal) return;
    
    // Atualizar os checkboxes do modal com o estado atual
    const visibleFields = state.config.visibleFields || DEFAULT_VISIBLE_FIELDS;
    Object.keys(visibleFields).forEach(field => {
        const checkbox = document.getElementById(`switch-${field}`);
        if (checkbox) {
            checkbox.checked = visibleFields[field];
        }
    });
    
    dom.fieldsModal.classList.remove('hidden');
}

function closeFieldsModal() {
    if (dom.fieldsModal) {
        dom.fieldsModal.classList.add('hidden');
    }
}

function saveFieldsConfig() {
    if (!state.config.visibleFields) {
        state.config.visibleFields = {};
    }
    
    const fields = Object.keys(DEFAULT_VISIBLE_FIELDS);
    fields.forEach(field => {
        const checkbox = document.getElementById(`switch-${field}`);
        if (checkbox) {
            state.config.visibleFields[field] = checkbox.checked;
        }
    });
    
    saveConfig();
    applyFieldVisibility();
    renderPreviewAndPrint();
    closeFieldsModal();
}

function restoreFieldsDefaults() {
    if (confirm('Deseja restaurar a exibição de todos os campos para o padrão?')) {
        const fields = Object.keys(DEFAULT_VISIBLE_FIELDS);
        fields.forEach(field => {
            const checkbox = document.getElementById(`switch-${field}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        saveFieldsConfig(); // Salvar e aplicar imediatamente!
    }
}

function selectAllFields() {
    const fields = Object.keys(DEFAULT_VISIBLE_FIELDS);
    fields.forEach(field => {
        const checkbox = document.getElementById(`switch-${field}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

function deselectAllFields() {
    const fields = Object.keys(DEFAULT_VISIBLE_FIELDS);
    fields.forEach(field => {
        const checkbox = document.getElementById(`switch-${field}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

// INICIAR APLICAÇÃO
window.onload = init;
