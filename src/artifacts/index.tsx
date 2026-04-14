import { useState, useEffect, useRef } from "react";
import { Calendar, AlertCircle, CheckCircle, Clock, Plus, X, Upload, User, FileText, Paperclip } from "lucide-react";

const STATUS_COLORS = {
  "Open": "bg-gray-400",
  "In-Progress": "bg-blue-500",
  "Request for Closing": "bg-yellow-500",
  "추가 F-Up Request": "bg-orange-500",
  "Closed": "bg-green-500",
  "Re-Open": "bg-purple-500"
};

const PRIORITY_COLORS = {
  High: "text-red-600",
  Medium: "text-yellow-600",
  Low: "text-green-600"
};

const SAMPLE_DATA = [
  {
    id: 1, meeting: "경영회의", majorArea: "Investment", minorArea: "상품기획",
    priority: "High", directive: "Q2 신제품 라인업 기획안 검토 및 승인",
    assignee: "김철수", dueDate: "2026-02-20", status: "In-Progress",
    createdAt: "2026-02-10",
    history: [
      { date: "2026-02-10", action: "Open", user: "Admin", note: "지시사항 등록" },
      { date: "2026-02-11", action: "In-Progress", user: "김철수", note: "작업 시작. 초안 작성 중입니다." }
    ]
  },
  {
    id: 2, meeting: "R&D 회의", majorArea: "Winning R&D", minorArea: "개발",
    priority: "High", directive: "차세대 배터리 기술 개발 로드맵 수립",
    assignee: "이영희", dueDate: "2026-02-15", status: "Request for Closing",
    createdAt: "2026-02-01",
    history: [
      { date: "2026-02-01", action: "Open", user: "Admin", note: "지시사항 등록" },
      { date: "2026-02-02", action: "In-Progress", user: "이영희", note: "작업 시작" },
      { date: "2026-02-14", action: "Request for Closing", user: "이영희", note: "로드맵 완성. 검토 요청드립니다.", attachments: [{ name: "roadmap.pdf", size: "2.3MB" }] }
    ]
  },
  {
    id: 3, meeting: "영업전략회의", majorArea: "AX", minorArea: "영업",
    priority: "Medium", directive: "해외 거점 확대 전략 수립",
    assignee: "박민수", dueDate: "2026-02-10", status: "Open",
    createdAt: "2026-02-08",
    history: [{ date: "2026-02-08", action: "Open", user: "Admin", note: "지시사항 등록" }]
  },
  {
    id: 4, meeting: "품질회의", majorArea: "AX", minorArea: "품질",
    priority: "High", directive: "불량률 개선 액션플랜 수립",
    assignee: "최지훈", dueDate: "2026-03-01", status: "In-Progress",
    createdAt: "2026-02-05",
    history: [
      { date: "2026-02-05", action: "Open", user: "Admin", note: "지시사항 등록" },
      { date: "2026-02-06", action: "In-Progress", user: "최지훈", note: "현황 분석 완료. 개선안 도출 중" }
    ]
  },
  {
    id: 5, meeting: "경영회의", majorArea: "Investment", minorArea: "마케팅",
    priority: "Medium", directive: "SNS 마케팅 캠페인 기획",
    assignee: "정수연", dueDate: "2026-02-25", status: "Closed",
    createdAt: "2026-01-20",
    history: [
      { date: "2026-01-20", action: "Open", user: "Admin", note: "지시사항 등록" },
      { date: "2026-01-21", action: "In-Progress", user: "정수연", note: "기획안 작성 시작" },
      { date: "2026-02-01", action: "Request for Closing", user: "정수연", note: "캠페인 기획안 완료" },
      { date: "2026-02-02", action: "Closed", user: "AX센터", note: "승인 완료. 잘 진행해주세요." }
    ]
  }
];

/* ─── File Drop Zone ─── */
const FileDropZone = ({ files, onFilesChange, matchHeight }) => {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    onFilesChange([...files, ...Array.from(e.dataTransfer.files)]);
  };
  const handleSelect = (e) => {
    onFilesChange([...files, ...Array.from(e.target.files)]);
    e.target.value = "";
  };
  const removeFile = (idx) => onFilesChange(files.filter((_, i) => i !== idx));

  return (
    <div className={`space-y-2 ${matchHeight ? "flex flex-col h-full" : ""}`}>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-3 cursor-pointer transition-colors text-sm
          ${matchHeight ? "flex-1" : "py-4"}
          ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}`}
      >
        <Upload size={20} className={dragging ? "text-blue-500" : "text-gray-400"} />
        <p className={`mt-1 font-medium text-center ${dragging ? "text-blue-600" : "text-gray-500"}`}>
          {dragging ? "여기에 놓으세요!" : "드래그 또는 클릭"}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">모든 파일 형식 지원</p>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleSelect} />
      </div>
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-3 py-1.5 text-sm">
              <div className="flex items-center gap-1 text-blue-700 truncate">
                <Paperclip size={12} />
                <span className="truncate text-xs">{f.name}</span>
                <span className="text-blue-400 text-xs whitespace-nowrap">({(f.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button onClick={e => { e.stopPropagation(); removeFile(i); }} className="ml-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Update Input ─── */
const UpdateInput = ({ text, setText, files, setFiles, placeholder }) => (
  <div className="flex gap-3 items-stretch">
    <textarea
      value={text} onChange={e => setText(e.target.value)}
      className="flex-1 border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      style={{ minHeight: "120px" }}
      placeholder={placeholder || "내용을 입력하세요..."}
    />
    <div className="w-52 flex-shrink-0 flex flex-col" style={{ minHeight: "120px" }}>
      <FileDropZone files={files} onFilesChange={setFiles} matchHeight />
    </div>
  </div>
);

/* ─── Donut Chart ─── */
const DonutChart = ({ data, title, onSliceClick }) => {
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
  const total = data.reduce((s, d) => s + d.total, 0);
  let cur = 0;
  const segments = data.map((item, i) => {
    const angle = total > 0 ? (item.total / total) * 360 : 0;
    const start = cur; cur += angle;
    return { ...item, angle, start, color: colors[i % colors.length] };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
      <div className="flex items-center justify-center mb-4">
        <svg width="180" height="180" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
          {segments.map((seg, i) => {
            if (seg.angle === 0) return null;
            const s = (seg.start - 90) * Math.PI / 180;
            const e = (seg.start + seg.angle - 90) * Math.PI / 180;
            const x1 = 100 + 80 * Math.cos(s), y1 = 100 + 80 * Math.sin(s);
            const x2 = 100 + 80 * Math.cos(e), y2 = 100 + 80 * Math.sin(e);
            return (
              <path key={i}
                d={`M100 100 L${x1} ${y1} A80 80 0 ${seg.angle > 180 ? 1 : 0} 1 ${x2} ${y2}Z`}
                fill={seg.color} className="cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => onSliceClick(seg.name)} />
            );
          })}
          <circle cx="100" cy="100" r="50" fill="white" />
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: seg.color }} />
              <span className="font-medium">{seg.name}</span>
            </div>
            <span className="text-gray-500">{seg.closed}/{seg.total} ({seg.total > 0 ? (seg.closed / seg.total * 100).toFixed(0) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── History List ─── */
const HistoryList = ({ history }) => (
  <div className="space-y-2">
    {history.filter(h => h.note || (h.attachments && h.attachments.length > 0)).map((h, i) => (
      <div key={i} className="border-l-4 border-blue-400 pl-4 py-2">
        <div className="flex items-start justify-between gap-2">
          {h.note && (
            <p className="text-sm text-gray-800">
              <span className="font-semibold text-gray-700">[{h.user}]</span> {h.note}
            </p>
          )}
          <span className="text-xs text-gray-400 whitespace-nowrap">{h.date}</span>
        </div>
        {h.attachments && h.attachments.length > 0 && (
          <div className="mt-1 space-y-1">
            {h.attachments.map((a, j) => (
              <a key={j} href="#" className="text-sm text-blue-600 flex items-center gap-1 hover:underline w-fit">
                <Paperclip size={13} />{a.name}
                {a.size && <span className="text-xs text-gray-400">({a.size})</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ─── Detail Modal ─── */
const DetailModal = ({ directive, userMode, onClose, onStatusChange }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  if (!directive) return null;

  const actorLabel = userMode === "axcenter" ? "AX센터" : directive.assignee;
  const isProgressStatus = ["In-Progress", "추가 F-Up Request", "Re-Open",
    ...(userMode === "assignee" ? ["Request for Closing"] : [])
  ].includes(directive.status);

  const commit = (newStatus) => {
    const attachments = files.map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` }));
    onStatusChange(directive.id, newStatus, text, actorLabel, attachments);
    setText(""); setFiles([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full flex flex-col" style={{ maxHeight: "90vh" }}>

        {/* Fixed header */}
        <div className="flex-shrink-0 border-b px-6 py-4 flex justify-between items-center bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">지시사항 상세</h2>
            <span className={`text-white text-sm px-3 py-1 rounded-full ${STATUS_COLORS[directive.status]}`}>{directive.status}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Basic info grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ["회의체", directive.meeting], ["대영역", directive.majorArea],
              ["소영역", directive.minorArea], ["담당자", directive.assignee],
              ["우선순위", <span className={`font-bold ${PRIORITY_COLORS[directive.priority]}`}>{directive.priority}</span>],
              ["마감일", directive.dueDate]
            ].map(([label, val], i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">{label}</p>
                <p className="text-gray-800 text-sm">{val}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">지시사항</p>
            <p className="bg-gray-50 rounded p-3 text-sm text-gray-800">{directive.directive}</p>
          </div>

          {/* Open */}
          {directive.status === "Open" && (
            <div className="flex justify-end">
              <button onClick={() => commit("In-Progress")}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                작업 시작 (In-Progress 전환)
              </button>
            </div>
          )}

          {/* In-Progress / 추가F-Up / Re-Open / (담당자: Request for Closing) */}
          {isProgressStatus && (
            <>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">진척현황 업데이트</p>
                <UpdateInput text={text} setText={setText} files={files} setFiles={setFiles} placeholder="진행 상황을 입력하세요..." />
                <div className="flex gap-2 pt-1">
                  <button onClick={() => commit(directive.status)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 text-sm">
                    진척현황 업데이트
                  </button>
                  <button onClick={() => commit("Request for Closing")}
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 text-sm">
                    완료 요청
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">진척 히스토리</p>
                <HistoryList history={directive.history} />
              </div>
            </>
          )}

          {/* AX센터: Request for Closing */}
          {directive.status === "Request for Closing" && userMode === "axcenter" && (
            <>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">AX센터 코멘트</p>
                <UpdateInput text={text} setText={setText} files={files} setFiles={setFiles} placeholder="코멘트를 입력하세요..." />
                <div className="flex gap-2 pt-1">
                  <button onClick={() => commit("Closed")}
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 text-sm">
                    승인 및 종료
                  </button>
                  <button onClick={() => commit("추가 F-Up Request")}
                    className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 text-sm">
                    추가 Follow-up 요청
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">진척 히스토리</p>
                <HistoryList history={directive.history} />
              </div>
            </>
          )}

          {/* Closed */}
          {directive.status === "Closed" && (
            <>
              {userMode === "axcenter" && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500">Re-Open 사유</p>
                  <UpdateInput text={text} setText={setText} files={files} setFiles={setFiles} placeholder="Re-Open 사유를 입력하세요..." />
                  <div className="flex justify-end">
                    <button onClick={() => commit("Re-Open")}
                      className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 text-sm">
                      Re-Open
                    </button>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">진척 히스토리</p>
                <HistoryList history={directive.history} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Add Modal ─── */
const AddModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    meeting: "", majorArea: "Investment", minorArea: "공통",
    priority: "Medium", directive: "", assignee: "", dueDate: ""
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="flex-shrink-0 border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">새 지시사항 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">회의체</label>
            <input value={form.meeting} onChange={e => set("meeting", e.target.value)}
              className="w-full border rounded-lg p-2 text-sm" placeholder="예: 경영회의" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">대영역</label>
              <select value={form.majorArea} onChange={e => set("majorArea", e.target.value)} className="w-full border rounded-lg p-2 text-sm">
                <option>Investment</option><option>Winning R&D</option><option>AX</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">소영역</label>
              <select value={form.minorArea} onChange={e => set("minorArea", e.target.value)} className="w-full border rounded-lg p-2 text-sm">
                {["공통","상품기획","구매/SCM","개발","품질","제조","영업","마케팅","서비스"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">지시사항</label>
            <textarea value={form.directive} onChange={e => set("directive", e.target.value)}
              className="w-full border rounded-lg p-2 text-sm min-h-[90px] resize-none" placeholder="지시사항 내용을 입력하세요" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">담당자</label>
              <input value={form.assignee} onChange={e => set("assignee", e.target.value)} className="w-full border rounded-lg p-2 text-sm" placeholder="이름" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">우선순위</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)} className="w-full border rounded-lg p-2 text-sm">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">마감일</label>
              <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50">취소</button>
            <button onClick={() => onAdd(form)} className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main App ─── */
export default function App() {
  const [userMode, setUserMode] = useState("axcenter");
  const [directives, setDirectives] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("directives-data");
      setDirectives(stored ? JSON.parse(stored) : SAMPLE_DATA);
      if (!stored) localStorage.setItem("directives-data", JSON.stringify(SAMPLE_DATA));
    } catch { setDirectives(SAMPLE_DATA); }
  }, []);

  const save = (data) => {
    setDirectives(data);
    try { localStorage.setItem("directives-data", JSON.stringify(data)); } catch {}
  };

  const isOverdue = (d) => d.status !== "Closed" && new Date(d.dueDate) < new Date();
  const isDueSoon = (d) => {
    if (d.status === "Closed") return false;
    const diff = Math.ceil((new Date(d.dueDate) - new Date()) / 86400000);
    return diff >= 0 && diff <= 14;
  };

  const handleStatusChange = (id, newStatus, note, user, attachments = []) => {
    const updated = directives.map(d => {
      if (d.id !== id) return d;
      const entry = { date: new Date().toISOString().split("T")[0], action: newStatus, user: user || "Unknown", note: note || `상태 변경: ${newStatus}` };
      if (attachments.length > 0) entry.attachments = attachments;
      return { ...d, status: newStatus, history: [...d.history, entry] };
    });
    save(updated);
    setSelected(updated.find(d => d.id === id));
  };

  const addDirective = (form) => {
    const nd = { id: Date.now(), ...form, status: "Open", createdAt: new Date().toISOString().split("T")[0],
      history: [{ date: new Date().toISOString().split("T")[0], action: "Open", user: "Admin", note: "지시사항 등록" }] };
    save([...directives, nd]);
    setShowAdd(false);
  };

  const getAreaData = (key) => {
    const keys = [...new Set(directives.map(d => d[key]))];
    return keys.map(k => {
      const f = directives.filter(d => d[key] === k);
      return { name: k, closed: f.filter(d => d.status === "Closed").length, total: f.length };
    });
  };

  const assigneeStats = () => {
    const src = selectedChart ? directives.filter(d => d.meeting === selectedChart || d.majorArea === selectedChart) : directives;
    return [...new Set(src.map(d => d.assignee))].map(a => {
      const f = src.filter(d => d.assignee === a);
      return { name: a, closed: f.filter(d => d.status === "Closed").length, total: f.length };
    });
  };

  const stats = {
    total: directives.length,
    dueSoon: directives.filter(isDueSoon).length,
    overdue: directives.filter(isOverdue).length,
    requestClosing: directives.filter(d => d.status === "Request for Closing").length
  };

  const filtered = directives
    .filter(d => {
      if (filterType === "dueSoon") return isDueSoon(d);
      if (filterType === "overdue") return isOverdue(d);
      if (filterType === "requestClosing") return d.status === "Request for Closing";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "priority") return { High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority];
      if (sortBy === "assignee") return a.assignee.localeCompare(b.assignee);
      if (sortBy === "meeting") return a.meeting.localeCompare(b.meeting);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AX센터 지시사항 관리 시스템</h1>
              <p className="text-gray-500 mt-1 text-sm">Executive Directive Tracker</p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setUserMode("assignee")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${userMode === "assignee" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                <User size={16} /> 담당자 모드
              </button>
              <button onClick={() => setUserMode("axcenter")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${userMode === "axcenter" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                <User size={16} /> AX센터 모드
              </button>
              {userMode === "axcenter" && (
                <button onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                  <Plus size={16} /> 새 지시사항
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Donut Charts */}
        <div className="grid grid-cols-2 gap-6">
          <DonutChart data={getAreaData("meeting")} title="회의체별 완료 현황" onSliceClick={setSelectedChart} />
          <DonutChart data={getAreaData("majorArea")} title="대영역별 완료 현황" onSliceClick={setSelectedChart} />
        </div>

        {/* Assignee Bar Chart */}
        {selectedChart && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">{selectedChart} — 담당자별 이행 현황</h3>
              <button onClick={() => setSelectedChart(null)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {assigneeStats().map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700 text-right">{s.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-7 relative">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-7 rounded-full flex items-center justify-end pr-3 text-white text-xs font-bold"
                      style={{ width: `${s.total > 0 ? (s.closed / s.total * 100) : 0}%`, minWidth: s.closed > 0 ? "2rem" : 0 }}>
                      {s.total > 0 ? (s.closed / s.total * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                  <div className="w-16 text-xs text-gray-500 text-right">{s.closed}/{s.total}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { key: "all", label: "전체", val: stats.total, icon: <FileText className="text-blue-500" size={22} />, ring: "ring-blue-500", color: "text-gray-800" },
            { key: "dueSoon", label: "2주 이내", val: stats.dueSoon, icon: <Clock className="text-yellow-500" size={22} />, ring: "ring-yellow-500", color: "text-yellow-600" },
            { key: "overdue", label: "기한 초과", val: stats.overdue, icon: <AlertCircle className="text-red-500" size={22} />, ring: "ring-red-500", color: "text-red-600" },
            { key: "requestClosing", label: "완료 요청", val: stats.requestClosing, icon: <CheckCircle className="text-green-500" size={22} />, ring: "ring-green-500", color: "text-green-600" }
          ].map(c => (
            <button key={c.key} onClick={() => setFilterType(c.key)}
              className={`bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow ${filterType === c.key ? `ring-2 ${c.ring}` : ""}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm font-semibold">{c.label}</span>{c.icon}
              </div>
              <div className={`text-3xl font-bold ${c.color}`}>{c.val}</div>
            </button>
          ))}
        </div>

        {/* Directives Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">
              지시사항 목록 <span className="text-sm font-normal text-gray-500 ml-1">({filtered.length}건)</span>
            </h3>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="dueDate">마감일순</option>
              <option value="priority">우선순위순</option>
              <option value="assignee">담당자순</option>
              <option value="meeting">회의체순</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {["회의체","대영역","소영역","지시사항","담당자","우선순위","마감일","상태"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(d => (
                  <tr key={d.id} onClick={() => setSelected(d)}
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${isOverdue(d) ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 text-sm text-gray-800">{d.meeting}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{d.majorArea}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{d.minorArea}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">{d.directive}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{d.assignee}</td>
                    <td className={`px-4 py-3 text-sm font-bold ${PRIORITY_COLORS[d.priority]}`}>{d.priority}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className={isOverdue(d) ? "text-red-500" : "text-gray-400"} />
                        <span className={isOverdue(d) ? "text-red-600 font-bold" : "text-gray-800"}>{d.dueDate}</span>
                        {isOverdue(d) && <AlertCircle size={14} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-white text-xs px-2 py-1 rounded-full ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && <DetailModal directive={selected} userMode={userMode} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={addDirective} />}
    </div>
  );
}