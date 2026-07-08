import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Layers, Paintbrush, ArrowLeft, RefreshCw, Trash2, 
  Plus, Edit2, Sliders, Check, Download, ZoomIn, ZoomOut, 
  Eye, HelpCircle, ChevronRight, Zap, Star, Shield, ArrowUpRight, 
  Trash, Save, Undo, Redo, FileImage, Upload, ListFilter
} from 'lucide-react';
import { Project, HistoryItem, User } from '../types';

interface StudioProps {
  user: User;
  onUpdateCredits: (credits: number) => void;
  onBackToLanding: () => void;
}

export default function Studio({ user, onUpdateCredits, onBackToLanding }: StudioProps) {
  // Static dataset matching our projects
  const initialProjects: Project[] = [
    { id: 'sc-proj', name: 'ComfyUI_temp_dmiou_00026', createdAt: '2026-07-07 21:15' },
    { id: 'kit-proj', name: 'Nhà Bếp Gỗ Sồi Hiện Đại', createdAt: '2026-07-07 20:30' },
    { id: 'cafe-proj', name: 'Quán Cafe Industrial Loft', createdAt: '2026-07-07 19:45' }
  ];

  const initialHistoryItems: HistoryItem[] = [
    // Project 1: Scandinavia
    {
      id: 'sc-orig',
      projectId: 'sc-proj',
      step: 'original',
      title: 'Bản vẽ thô ban đầu',
      subtitle: 'Sketch thô tải lên',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      timestamp: '21:15'
    },
    {
      id: 'sc-b1',
      projectId: 'sc-proj',
      step: 'B1',
      title: 'B1 - Generate Concept',
      subtitle: ' Scandinavian Style Concept',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      timestamp: '21:16',
      prompt: 'phòng khách phong cách Nhật Bản & Scandinavia tối giản, gỗ nhạt, ánh sáng tự nhiên dịu mát',
      settings: { model: 'Flash', mood: 'Nắng ban ngày ấm áp' }
    },
    {
      id: 'sc-b2',
      projectId: 'sc-proj',
      step: 'B2',
      title: 'B2 - Layer Blend',
      subtitle: 'Giữ kết cấu dầm cột',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      timestamp: '21:17',
      settings: { opacity: 75, brushSize: 40, feather: 8 }
    },
    {
      id: 'sc-b3',
      projectId: 'sc-proj',
      step: 'B3',
      title: 'B3 - Inpaint (Chỉnh Sofa)',
      subtitle: 'Thay chất liệu sofa da bò',
      imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80',
      timestamp: '21:20',
      prompt: 'thay sofa thành chất liệu da màu bò cognac sang trọng, ăn nhập ánh sáng phòng',
      settings: { edgeBlend: '8px' }
    },

    // Project 2: Kitchen
    {
      id: 'kit-orig',
      projectId: 'kit-proj',
      step: 'original',
      title: 'Bản vẽ thô tủ bếp',
      subtitle: 'Kitchen sketch',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      timestamp: '20:30'
    },
    {
      id: 'kit-b1',
      projectId: 'kit-proj',
      step: 'B1',
      title: 'B1 - Concept',
      subtitle: 'Modern White Kitchen Render',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-11142117c087?auto=format&fit=crop&w=1200&q=80',
      timestamp: '20:32',
      prompt: 'modern white minimalist kitchen workspace, smooth light materials',
      settings: { model: 'Pro', mood: 'Nắng hoàng hôn' }
    },
    {
      id: 'kit-b3',
      projectId: 'kit-proj',
      step: 'B3',
      title: 'B3 - Inpaint (Tủ gỗ)',
      subtitle: 'Thay tủ gỗ Sồi ấm',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      timestamp: '20:40',
      prompt: 'replace kitchen cabinets with warm oak wood textured cabinets',
      settings: { edgeBlend: '4px' }
    },

    // Project 3: Cafe
    {
      id: 'cafe-orig',
      projectId: 'cafe-proj',
      step: 'original',
      title: 'Sketch thô cafe',
      subtitle: 'Industrial cafe sketch',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      timestamp: '19:45'
    },
    {
      id: 'cafe-b1',
      projectId: 'cafe-proj',
      step: 'B1',
      title: 'B1 - Concept Render',
      subtitle: 'Industrial Concrete Vibe',
      imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
      timestamp: '19:48',
      prompt: 'industrial design coffee shop, concrete floor, copper metal lights',
      settings: { model: 'Flash' }
    }
  ];

  // Projects and History state
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('archlab_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('archlab_history');
    return saved ? JSON.parse(saved) : initialHistoryItems;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>('sc-proj');
  const [activeStep, setActiveStep] = useState<'B1' | 'B2' | 'B3'>('B1');
  
  // History tree filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'B1' | 'B2' | 'B3'>('all');

  // Interactive controls
  const [selectedModel, setSelectedModel] = useState<'Flash' | 'Pro'>('Flash');
  const [selectedMood, setSelectedMood] = useState<string>('Giữ nguyên (chỉ làm đúng prompt)');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationTimeLeft, setGenerationTimeLeft] = useState<number>(0);

  // Layer Blend state (B2)
  const [blendOpacity, setBlendOpacity] = useState<number>(75);
  const [brushSize, setBrushSize] = useState<number>(40);
  const [brushFeather, setBrushFeather] = useState<number>(8);
  const [brushMode, setBrushMode] = useState<'erase' | 'restore'>('erase');
  const [isPainting, setIsPainting] = useState<boolean>(false);

  // Inpaint state (B3)
  const [inpaintStitching, setInpaintStitching] = useState<'Full Box' | 'Mask Only'>('Mask Only');
  const [inpaintEdgeBlend, setInpaintEdgeBlend] = useState<string>('8px');
  const [inpaintExpansion, setInpaintExpansion] = useState<number>(0);

  // Canvas Refs for interactive painting
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('archlab_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('archlab_history', JSON.stringify(historyItems));
  }, [historyItems]);

  // Project changing resets steps or active image
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeProjectHistory = historyItems.filter(item => item.projectId === activeProjectId);
  
  // Get latest image of specific step or fallback
  const getStepImage = (step: 'original' | 'B1' | 'B2' | 'B3'): string => {
    const found = activeProjectHistory.find(item => item.step === step);
    if (found) return found.imageUrl;
    
    // Fallbacks
    if (step === 'B3') return getStepImage('B2');
    if (step === 'B2') return getStepImage('B1');
    if (step === 'B1') return getStepImage('original');
    
    return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
  };

  const getOriginalImage = () => getStepImage('original');
  const getB1Image = () => getStepImage('B1');

  // Redraw canvases on mode or size change
  useEffect(() => {
    if (activeStep === 'B2' || activeStep === 'B3') {
      initCanvas();
    }
  }, [activeStep, activeProjectId, blendOpacity]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImageSrc = getOriginalImage();
    const fgImageSrc = getStepImage('B1');

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = bgImageSrc;
    bgImg.referrerPolicy = "no-referrer";

    const fgImg = new Image();
    fgImg.crossOrigin = "anonymous";
    fgImg.src = fgImageSrc;
    fgImg.referrerPolicy = "no-referrer";

    fgImg.onload = () => {
      // Set canvas size matching container ratio
      canvas.width = 800;
      canvas.height = 600;
      
      // Draw foreground image first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = blendOpacity / 100;
      ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;
    };
  };

  // Canvas Mouse painting triggers (either erasing in B2, or painting red mask in B3)
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale factor between canvas internal coordinates and displayed coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPainting(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getMousePos(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeStep === 'B2') {
      // Erase foreground to reveal the background
      if (brushMode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Restore: Draw original foreground pixels back on top
        ctx.globalCompositeOperation = 'source-over';
        const fgImg = new Image();
        fgImg.crossOrigin = "anonymous";
        fgImg.referrerPolicy = "no-referrer";
        fgImg.src = getStepImage('B1');
        fgImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.globalAlpha = blendOpacity / 100;
          ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        };
      }
    } else if (activeStep === 'B3') {
      // Draw red semi-transparent mask
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)'; // Semi transparent red
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const stopDrawing = () => {
    setIsPainting(false);
  };

  // Enhance prompt helper
  const handleEnhancePrompt = () => {
    if (!customPrompt) {
      setCustomPrompt('thay sofa thành da màu nâu cao cấp');
    }
    const enhancements = [
      ", chất liệu da thật siêu thực, ánh sáng studio mềm ấm, phản chiếu dịu nhẹ, giữ nguyên bố cục không gian, chi tiết 4K photorealistic",
      ", kết cấu gỗ tự nhiên chuẩn chỉ, edge blend mềm mại, phong cách kiến trúc luxury, hài hòa phong thủy và luồng sáng tự nhiên",
      ", thớ đá Marble sang trọng, phản quang tinh xảo, đường nét hiện đại sắc sảo, hoàn thiện chân thực như ảnh chụp dự án thực tế"
    ];
    const randomEnhance = enhancements[Math.floor(Math.random() * enhancements.length)];
    setCustomPrompt(prev => prev + randomEnhance);
  };

  // Run AI generator simulation
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const totalTime = selectedModel === 'Flash' ? 15 : 45;
    setGenerationTimeLeft(totalTime);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finalizeGeneration();
          return 100;
        }
        return prev + (100 / (totalTime * 2)); // updates every 500ms
      });
      setGenerationTimeLeft(prev => Math.max(0, parseFloat((prev - 0.5).toFixed(1))));
    }, 500);
  };

  const finalizeGeneration = () => {
    setIsGenerating(false);
    
    // Deduct credit
    const cost = selectedModel === 'Pro' ? 5 : 1;
    onUpdateCredits(Math.max(0, user.credits - cost));

    const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (activeStep === 'B1') {
      // Create new history item for B1
      const newB1Item: HistoryItem = {
        id: `gen-b1-${Date.now()}`,
        projectId: activeProjectId,
        step: 'B1',
        title: `B1 - Concept Render (${selectedModel})`,
        subtitle: `${selectedModel} Concept Render`,
        imageUrl: activeProjectId === 'sc-proj' 
          ? 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          : activeProjectId === 'kit-proj'
            ? 'https://images.unsplash.com/photo-1556911220-11142117c087?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
        timestamp: timeString,
        prompt: customPrompt || 'phòng phong cách hiện đại sang trọng',
        settings: { model: selectedModel, mood: selectedMood }
      };

      setHistoryItems(prev => [newB1Item, ...prev]);
    } else if (activeStep === 'B3') {
      // Create new history item for B3 (Inpaint)
      const newB3Item: HistoryItem = {
        id: `gen-b3-${Date.now()}`,
        projectId: activeProjectId,
        step: 'B3',
        title: `B3 - Inpaint (Chỉnh sửa gỗ/vải)`,
        subtitle: 'Inpainted Area Refined',
        imageUrl: activeProjectId === 'sc-proj'
          ? 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80'
          : activeProjectId === 'kit-proj'
            ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        timestamp: timeString,
        prompt: customPrompt || 'Inpaint bôi sửa cục bộ',
        settings: { edgeBlend: inpaintEdgeBlend }
      };

      setHistoryItems(prev => [newB3Item, ...prev]);
    }
  };

  // Save Layer Blend output (B2)
  const handleSaveLayerBlend = () => {
    const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newB2Item: HistoryItem = {
      id: `gen-b2-${Date.now()}`,
      projectId: activeProjectId,
      step: 'B2',
      title: 'B2 - Layer Blend (Đã Lưu)',
      subtitle: `Khung thô blend (${blendOpacity}%)`,
      imageUrl: getStepImage('B1'), // In mockup we use the same, overlaid on Canvas
      timestamp: timeString,
      settings: { opacity: blendOpacity, brushSize: brushSize, feather: brushFeather }
    };

    setHistoryItems(prev => [newB2Item, ...prev]);
    alert("Đã lưu lớp Layer Blend thành công vào History Tree!");
  };

  // Dynamic project creation
  const handleAddNewProject = () => {
    const name = prompt("Nhập tên dự án nội thất mới:");
    if (!name) return;

    const newId = `proj-${Date.now()}`;
    const timeString = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    const newProj: Project = {
      id: newId,
      name: name,
      createdAt: timeString
    };

    const originalSketch: HistoryItem = {
      id: `orig-${Date.now()}`,
      projectId: newId,
      step: 'original',
      title: 'Ảnh bản vẽ thô tải lên',
      subtitle: 'Sketch thô gốc',
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      timestamp: 'Vừa xong'
    };

    setProjects(prev => [...prev, newProj]);
    setHistoryItems(prev => [originalSketch, ...prev]);
    setActiveProjectId(newId);
    setActiveStep('B1');
  };

  const handleDeleteProject = () => {
    if (projects.length <= 1) {
      alert("Không thể xóa dự án duy nhất còn lại.");
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa dự án "${activeProject.name}"?`)) {
      const remainingProjects = projects.filter(p => p.id !== activeProjectId);
      setProjects(remainingProjects);
      setActiveProjectId(remainingProjects[0].id);
    }
  };

  // Custom Image Upload Simulator
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      // Update original image for current project or create new
      const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const customOriginal: HistoryItem = {
        id: `custom-orig-${Date.now()}`,
        projectId: activeProjectId,
        step: 'original',
        title: 'Ảnh tự upload của bạn',
        subtitle: file.name,
        imageUrl: imageUrl,
        timestamp: timeString
      };

      setHistoryItems(prev => [customOriginal, ...prev]);
      alert("Đã tải ảnh thiết kế của bạn lên thành công! Bắt đầu tạo Concept tại B1.");
    }
  };

  const filteredHistory = activeProjectHistory.filter(item => {
    if (historyFilter === 'all') return true;
    return item.step === historyFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] font-sans flex flex-col justify-between overflow-hidden">
      
      {/* STUDIO HEADER */}
      <header className="bg-[#121318] border-b border-white/5 h-16 shrink-0 flex items-center justify-between px-6">
        
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBackToLanding}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            title="Trở về Trang chủ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00F2FE] bg-clip-text text-transparent">
              ArchLab Studio
            </span>
            <span className="text-[10px] bg-[#00F2FE]/10 text-[#00F2FE] px-1.5 py-0.5 rounded font-mono font-bold">POC v1.0</span>
          </div>
        </div>

        {/* WORKFLOW SWITCHER (B1, B2, B3 Tabs) */}
        <div className="flex items-center bg-[#0B0C10] border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveStep('B1')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              activeStep === 'B1' 
                ? 'bg-[#00F2FE] text-black shadow-lg shadow-[#00F2FE]/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>B1 Generate</span>
          </button>

          <button
            onClick={() => setActiveStep('B2')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              activeStep === 'B2' 
                ? 'bg-[#7F00FF] text-white shadow-lg shadow-[#7F00FF]/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>B2 Layer Blend</span>
          </button>

          <button
            onClick={() => setActiveStep('B3')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              activeStep === 'B3' 
                ? 'bg-[#00F2FE] text-black shadow-lg shadow-[#00F2FE]/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>B3 Inpaint</span>
          </button>
        </div>

        {/* RIGHT CONTROLS: CREDIT STATUS */}
        <div className="flex items-center space-x-4">
          
          {/* Dual-Engine Core indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#0B0C10] border border-white/10 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-gray-400 font-mono">Engine:</span>
            <span className={`font-bold font-mono ${selectedModel === 'Pro' ? 'text-[#7F00FF]' : 'text-[#00F2FE]'}`}>
              {selectedModel === 'Pro' ? 'Model Pro (4K)' : 'Model Flash (15s)'}
            </span>
          </div>

          {/* Credits Counter */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7F00FF]/10 to-[#00F2FE]/10 border border-[#00F2FE]/20">
            <Zap className="w-3.5 h-3.5 text-[#00F2FE] animate-pulse" />
            <span className="text-xs font-mono font-bold text-white">{user.credits} Credits còn lại</span>
          </div>

          {/* User profile brief */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7F00FF] to-[#00F2FE] p-[1.5px]">
              <div className="w-full h-full bg-[#121318] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                AI
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[8px] text-[#A0AAB2] font-mono">{user.role}</p>
            </div>
          </div>

        </div>

      </header>

      {/* STUDIO LAYOUT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: PROJECT SELECTOR & HISTORY TREE */}
        <aside className="w-64 border-r border-white/5 bg-[#121318]/40 flex flex-col justify-between shrink-0">
          
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            
            {/* Project Selector section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono tracking-wider uppercase text-gray-500">Dự án hiện tại</span>
                <div className="flex space-x-1">
                  <button 
                    onClick={handleAddNewProject}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#00F2FE] transition-colors"
                    title="Tạo dự án mới"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={handleDeleteProject}
                    className="p-1 rounded bg-white/5 hover:bg-red-950/40 text-red-400 transition-colors"
                    title="Xóa dự án"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Dynamic Project Dropdown Selection */}
              <select 
                value={activeProjectId} 
                onChange={(e) => {
                  setActiveProjectId(e.target.value);
                  setActiveStep('B1'); // Reset step to B1 when project shifts
                }}
                className="w-full bg-[#121318] border border-white/10 rounded-lg py-2 px-2.5 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </div>

            {/* History Tree list with dynamic filter */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <span className="text-[9px] font-mono tracking-wider uppercase text-gray-500 flex items-center">
                  <ListFilter className="w-3 h-3 mr-1" />
                  Lịch Sử (History)
                </span>
                
                {/* Selector */}
                <select 
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value as any)}
                  className="bg-transparent text-[10px] text-[#00F2FE] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#121318] text-white">Tất cả</option>
                  <option value="B1" className="bg-[#121318] text-white">B1 Concept</option>
                  <option value="B2" className="bg-[#121318] text-white">B2 Blend</option>
                  <option value="B3" className="bg-[#121318] text-white">B3 Inpaint</option>
                </select>
              </div>

              {/* History list */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-600 text-[10px]">
                    Không có lịch sử cho bộ lọc này.
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div 
                      key={item.id}
                      className="group relative rounded-lg border border-white/5 p-1.5 bg-black/20 hover:border-[#00F2FE]/30 transition-all cursor-pointer"
                    >
                      <div className="flex space-x-2">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded overflow-hidden shrink-0 bg-black/40 border border-white/10">
                          <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover" 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {/* Info details */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <span className={`px-1 rounded text-[8px] font-mono font-bold uppercase ${
                              item.step === 'original' ? 'bg-gray-500/10 text-gray-400' :
                              item.step === 'B1' ? 'bg-cyan-500/10 text-cyan-400' :
                              item.step === 'B2' ? 'bg-purple-500/10 text-purple-400' : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {item.step}
                            </span>
                            <span className="text-[8px] text-gray-500 font-mono">{item.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-gray-200 truncate mt-1 font-semibold">{item.title}</p>
                          <p className="text-[8px] text-[#A0AAB2] truncate">{item.subtitle || item.prompt}</p>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

          {/* Quick info footer */}
          <div className="p-3 bg-black/30 border-t border-white/5 text-[9px] text-gray-500 text-left font-mono">
            <p>● Connected to ArchLab Core</p>
            <p>● User Type: Pro Architect</p>
          </div>

        </aside>

        {/* CENTRAL CANVAS: IMAGE WORKSPACE EDITOR */}
        <main className="flex-1 bg-[#0B0C10] p-6 flex flex-col justify-between overflow-hidden relative">
          
          {/* AI Generating Scanning Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-6">
              
              <div className="w-16 h-16 rounded-2xl bg-[#00F2FE]/10 flex items-center justify-center border border-[#00F2FE]/40 animate-bounce mb-6">
                <Sparkles className="w-8 h-8 text-[#00F2FE] animate-pulse" />
              </div>

              <div className="max-w-md w-full text-center space-y-4">
                <p className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                  Engine Đang Render Thiết Kế ({selectedModel})
                </p>
                
                {/* Progress bar */}
                <div className="w-full bg-white/5 border border-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7F00FF] to-[#00F2FE] transition-all duration-300 rounded-full"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>Tiến trình: {Math.round(generationProgress)}%</span>
                  <span>Thời gian còn lại: {generationTimeLeft} giây</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-left text-gray-400 leading-relaxed font-mono">
                  <span className="text-[#00F2FE]">System log:</span> [INFO] Loading latent interior weights... <br />
                  [INFO] Applying edge guidance matrix (99.4% lock)... <br />
                  [INFO] Denoising material textures.
                </div>
              </div>

            </div>
          )}

          {/* Editor Header Title & Quick actions */}
          <div className="flex items-center justify-between shrink-0 mb-4 bg-[#121318]/50 p-3 rounded-xl border border-white/5">
            <div className="text-left">
              <span className="text-[10px] font-mono text-[#00F2FE] uppercase tracking-wider">
                {activeStep === 'B1' ? 'Khởi Tạo Ý Tưởng Concept' : activeStep === 'B2' ? 'Layer Blend Photoshop Mixer' : 'Chỉnh Sửa Vật Liệu Local'}
              </span>
              <h2 className="text-sm font-bold text-white">
                {activeStep === 'B1' ? 'B1 — Generate Concept' : activeStep === 'B2' ? 'B2 — Layer Blend (Giữ kết cấu thô)' : 'B3 — AI Inpaint (Bôi Mask đỏ đổi tủ/sàn)'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  if (activeStep === 'B2' || activeStep === 'B3') initCanvas();
                }}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Làm mới Canvas"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Visual interactive canvas wrapper */}
          <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/40 rounded-2xl border border-white/5 relative p-4">
            
            {/* Step B1 - Standard view with image comparison toggles */}
            {activeStep === 'B1' && (
              <div className="relative max-h-full max-w-full aspect-[4/3] rounded-lg overflow-hidden group">
                {/* Generated result */}
                <img 
                  src={getStepImage('B1')} 
                  className="max-h-full max-w-full object-contain rounded-lg"
                  alt="studio b1 display"
                  referrerPolicy="no-referrer"
                />
                
                {/* Comparative tooltip or hover indicator */}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 p-2.5 rounded-lg text-xs">
                  <p className="text-gray-400 text-[10px]">Trực quan hóa thiết kế:</p>
                  <p className="font-bold text-white mt-0.5">Sử dụng thanh gạt ở B2 để phối hợp nét vẽ gốc.</p>
                </div>
              </div>
            )}

            {/* Step B2 & B3 - Interactive Drawing Canvas */}
            {(activeStep === 'B2' || activeStep === 'B3') && (
              <div className="relative max-h-full max-w-full aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center">
                
                {/* Background image under drawing layer */}
                <img 
                  src={getOriginalImage()} 
                  className="absolute max-h-full max-w-full object-contain opacity-50 pointer-events-none rounded-lg"
                  alt="original background sketch"
                  referrerPolicy="no-referrer"
                />

                {/* Drawing interactive canvas overlay */}
                <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="relative z-10 max-h-full max-w-full object-contain rounded-lg brush-cursor border border-dashed border-[#00F2FE]/20"
                  style={{ width: '100%', height: '100%' }}
                />

                {/* Hover circle indicator indicating brush size */}
                <div className="absolute top-4 right-4 bg-black/70 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-gray-300 z-20">
                  Cọ vẽ: {brushSize}px
                </div>

              </div>
            )}

          </div>

          {/* Editor Footer Help tips */}
          <div className="shrink-0 mt-4 text-left text-xs text-[#A0AAB2] bg-[#121318]/20 p-3 rounded-lg border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#00F2FE]" />
              <span>
                {activeStep === 'B1' ? 'Tải ảnh vẽ thô, gõ prompt và bấm Generate ở panel bên phải.' :
                 activeStep === 'B2' ? 'Bôi cọ xóa để lột bỏ lớp AI bị lỗi, hiển thị lại khung dầm ban đầu.' :
                 'Bôi cọ đỏ lên vùng tủ, gõ prompt "thay gỗ sồi" để AI sửa đổi cục bộ.'}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">ArchLab Studio Core</span>
          </div>

        </main>

        {/* RIGHT COLUMN: CONFIGURATIONS BASED ON STEP */}
        <aside className="w-80 border-l border-white/5 bg-[#121318]/40 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          {/* Main configuration settings */}
          <div className="space-y-6">
            
            {/* Model switcher */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Động cơ AI Core</span>
                <span className="text-[10px] text-gray-500 font-mono">Chọn lõi</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-lg">
                <button
                  onClick={() => setSelectedModel('Flash')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                    selectedModel === 'Flash' 
                      ? 'bg-[#00F2FE] text-black shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Model Flash (1s)
                </button>
                <button
                  onClick={() => setSelectedModel('Pro')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                    selectedModel === 'Pro' 
                      ? 'bg-[#7F00FF] text-white shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Model Pro (4K)
                </button>
              </div>
            </div>

            {/* B1 SPECIFIC OPTIONS */}
            {activeStep === 'B1' && (
              <div className="space-y-4">
                
                {/* Source Sketch / Image upload handler */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">1. Ảnh Thô Tải Lên</span>
                  </div>
                  
                  <div className="border border-dashed border-white/10 rounded-xl p-4 bg-black/20 text-center relative hover:border-[#00F2FE]/40 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-white">Click tải lên Sketch của bạn</p>
                    <p className="text-[9px] text-gray-500 mt-1">Hỗ trợ JPG, PNG, Drag/Drop</p>
                  </div>
                </div>

                {/* Mood & Lighting Selection */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">2. Mood & Lighting (Ánh Sáng)</label>
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full bg-black bg-opacity-30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="Giữ nguyên (chỉ làm đúng prompt)">Giữ nguyên theo Prompt</option>
                    <option value="Nắng ban ngày ấm áp">Nắng ban ngày ấm áp dịu</option>
                    <option value="Hoàng hôn vàng lãng mạn">Hoàng hôn rực rỡ lãng mạn</option>
                    <option value="Ánh đèn neon cyberpunk">Ánh đèn ấm ấm cúng ấm áp</option>
                  </select>
                </div>

                {/* Material style reference upload mockup */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">3. Style Reference (Học Phong Cách)</label>
                  <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-500">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-gray-400">Học phong cách từ chất liệu mẫu...</span>
                  </div>
                </div>

                {/* Prompt generator text area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-mono uppercase text-gray-400">4. Prompt mô tả chi tiết</label>
                    <button 
                      onClick={handleEnhancePrompt}
                      className="text-[9px] text-[#00F2FE] hover:underline font-bold flex items-center"
                    >
                      🪄 Tối ưu Prompt AI
                    </button>
                  </div>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Mô tả chất liệu, phong cách phòng (ví dụ: scandinavian, gỗ sồi sáng, cây xanh)..."
                    rows={3}
                    className="w-full bg-black bg-opacity-30 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00F2FE] resize-none"
                  />
                </div>

              </div>
            )}

            {/* B2 SPECIFIC OPTIONS (LAYER BLEND) */}
            {activeStep === 'B2' && (
              <div className="space-y-4">
                
                {/* Layer Opacity slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Độ đục Layer (Opacity)</span>
                    <span className="text-xs text-[#7F00FF] font-bold font-mono">{blendOpacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={blendOpacity}
                    onChange={(e) => setBlendOpacity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#7F00FF]"
                  />
                  <div className="flex justify-between text-[8px] text-gray-500 font-mono mt-1">
                    <span>Nét vẽ thô gốc</span>
                    <span>AI Render 100%</span>
                  </div>
                </div>

                {/* Layer stacked panel simulation */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2 block">Cây Layer Hiện Tại</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#7F00FF]/10 border border-[#7F00FF]/30 text-xs">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-3.5 h-3.5 text-[#7F00FF]" />
                        <span className="font-semibold text-white">AI Concept Gen Layer</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">ACTIVE</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Bản vẽ Original Sketch</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">Under</span>
                    </div>
                  </div>
                </div>

                {/* Brush size and feather configurations */}
                <div className="space-y-3.5 border-t border-white/5 pt-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Cỡ Cọ Brush (Xóa/Vá)</span>
                      <span className="text-xs text-gray-300 font-mono">{brushSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Độ Mềm Cọ (Feather)</span>
                      <span className="text-xs text-gray-300 font-mono">{brushFeather}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={brushFeather}
                      onChange={(e) => setBrushFeather(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 block">Chế Độ Vẽ Cọ</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setBrushMode('erase')}
                        className={`py-1 text-xs font-semibold rounded ${brushMode === 'erase' ? 'bg-[#7F00FF] text-white' : 'bg-black/30 text-gray-400'}`}
                      >
                        🖌️ Xóa bỏ AI Gen
                      </button>
                      <button
                        onClick={() => setBrushMode('restore')}
                        className={`py-1 text-xs font-semibold rounded ${brushMode === 'restore' ? 'bg-[#7F00FF] text-white' : 'bg-black/30 text-gray-400'}`}
                      >
                        🛠️ Phủ Lại AI Gen
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* B3 SPECIFIC OPTIONS (INPAINT LOCAL REPAIR) */}
            {activeStep === 'B3' && (
              <div className="space-y-4">
                
                {/* Local prompt text area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-mono uppercase text-gray-400">Prompt Cục Bộ Vùng Mask</label>
                    <button 
                      onClick={handleEnhancePrompt}
                      className="text-[9px] text-[#00F2FE] hover:underline font-bold"
                    >
                      🪄 Tối ưu AI
                    </button>
                  </div>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Bôi cọ đỏ lên sofa/tủ, gõ: 'thay sofa màu cognac chất liệu da cao cấp'..."
                    rows={3}
                    className="w-full bg-black bg-opacity-30 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00F2FE] resize-none"
                  />
                </div>

                {/* Brush size slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Kích thước cọ bôi Mask</span>
                    <span className="text-xs text-[#00F2FE] font-mono">{brushSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00F2FE]"
                  />
                </div>

                {/* Stitching and Edge Blend selections */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 block">STITCHING OPTIONS</span>
                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-lg">
                      <button
                        onClick={() => setInpaintStitching('Full Box')}
                        className={`py-1 text-xs font-semibold rounded ${inpaintStitching === 'Full Box' ? 'bg-[#00F2FE] text-black font-bold' : 'text-gray-400'}`}
                      >
                        Full Box
                      </button>
                      <button
                        onClick={() => setInpaintStitching('Mask Only')}
                        className={`py-1 text-xs font-semibold rounded ${inpaintStitching === 'Mask Only' ? 'bg-[#00F2FE] text-black font-bold' : 'text-gray-400'}`}
                      >
                        Mask Only
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Đường Viền Ghép (Edge Blend)</label>
                    <select
                      value={inpaintEdgeBlend}
                      onChange={(e) => setInpaintEdgeBlend(e.target.value)}
                      className="w-full bg-black bg-opacity-30 border border-white/10 rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    >
                      <option value="4px">4px - Viền mềm vừa</option>
                      <option value="8px">8px - Viền tàng hình mượt</option>
                      <option value="16px">16px - Trộn viền siêu mịn</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Mở rộng biên sửa (Expansion)</span>
                      <span className="text-xs text-gray-400 font-mono">{inpaintExpansion}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={inpaintExpansion}
                      onChange={(e) => setInpaintExpansion(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* GENERATE OR SAVE CTA BUTTON */}
          <div className="border-t border-white/5 pt-5 mt-6 space-y-3 text-left">
            
            {/* Display cost of credits */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>Định giá:</span>
              <span className="font-bold text-white">
                {activeStep === 'B2' ? 'Miễn phí' : selectedModel === 'Pro' ? '⚠️ Tốn 5 Credits / render' : '⚡ Tốn 1 Credit / render'}
              </span>
            </div>

            {activeStep === 'B2' ? (
              <button
                onClick={handleSaveLayerBlend}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7F00FF] to-[#00F2FE] hover:opacity-95 transition-all duration-300 flex items-center justify-center space-x-2 glow-cyan hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Blend Lịch Sử (B2)</span>
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || user.credits <= 0}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] hover:opacity-95 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg glow-cyan hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Đang Render...' : activeStep === 'B1' ? 'Render Concept Thần Tốc (B1)' : 'Render Inpaint Cục Bộ (B3)'}</span>
              </button>
            )}

          </div>

        </aside>

      </div>

    </div>
  );
}
