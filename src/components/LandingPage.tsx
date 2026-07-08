import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Check, ChevronRight, Play, ArrowRight, ShieldCheck, 
  Layers, Paintbrush, Sliders, Zap, History, LayoutGrid, 
  CheckCircle2, Star, MessageSquare, Eye, EyeOff, User as UserIcon, Mail, Lock, HelpCircle, Search 
} from 'lucide-react';
import { User } from '../types';

// FormSubmit.co endpoint - gửi email đến info@monart.vn
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/info@monart.vn';

interface LandingPageProps {
  onAuthSuccess: (user: User) => void;
  user: User;
  onNavigateToStudio: () => void;
}

export default function LandingPage({ onAuthSuccess, user, onNavigateToStudio }: LandingPageProps) {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'b1' | 'b2' | 'b3'>('b1');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [showcaseFilter, setShowcaseFilter] = useState<'all' | 'living' | 'kitchen' | 'cafe' | 'office'>('all');
  const [pricingSearch, setPricingSearch] = useState('');

  // Hero Before/After slider position
  const [heroSliderPos, setHeroSliderPos] = useState(45);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [isHeroSliding, setIsHeroSliding] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Interior Designer');
  const [formError, setFormError] = useState('');

  // Workflow auto rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowTab((prev) => {
        if (prev === 'b1') return 'b2';
        if (prev === 'b2') return 'b3';
        return 'b1';
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Handle slider mouse events
  const handleHeroSlide = (clientX: number) => {
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setHeroSliderPos(percentage);
  };

  const handleMouseDown = () => setIsHeroSliding(true);
  const handleTouchStart = () => setIsHeroSliding(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHeroSliding) return;
      handleHeroSlide(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isHeroSliding) return;
      if (e.touches[0]) {
        handleHeroSlide(e.touches[0].clientX);
      }
    };
    const handleMouseUp = () => setIsHeroSliding(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isHeroSliding]);

  // Showcase images with before/after comparisons
  const showcaseItems = [
    {
      id: 'sc-1',
      category: 'living',
      title: 'Phòng Khách Scandinavia',
      before: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sc-2',
      category: 'kitchen',
      title: 'Nhà Bếp Gỗ Sồi Hiện Đại',
      before: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sc-3',
      category: 'cafe',
      title: 'Quán Cafe Industrial Rustic',
      before: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sc-4',
      category: 'office',
      title: 'Văn Phòng Sáng Tạo Co-working',
      before: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sc-5',
      category: 'living',
      title: 'Phòng Ngủ Japandi Minimalist',
      before: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sc-6',
      category: 'kitchen',
      title: 'Căn Hộ Studio Loft',
      before: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const filteredShowcase = showcaseFilter === 'all' 
    ? showcaseItems 
    : showcaseItems.filter(item => item.category === showcaseFilter);

  // Authenticate simulation + gửi thông tin đăng ký về email
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }
    if (authTab === 'signup' && !fullName) {
      setFormError('Vui lòng điền họ và tên.');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Email không đúng định dạng.');
      return;
    }

    // Gửi thông tin đăng ký về info@monart.vn qua FormSubmit.co
    if (authTab === 'signup') {
      try {
        await fetch(FORMSUBMIT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            '_subject': `🆕 Đăng ký mới: ${fullName} (${email})`,
            'Họ và tên': fullName,
            'Email': email,
            'Lĩnh vực': role,
            'Thời gian': new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
          }),
        });
      } catch {
        // Vẫn cho phép đăng ký ngay cả khi gửi mail lỗi
      }
    }
    
    // Simulate auth success
    const mockUser: User = {
      loggedIn: true,
      email: email,
      name: authTab === 'signup' ? fullName : email.split('@')[0],
      role: role,
      credits: 50 // Gift 50 credits!
    };
    
    onAuthSuccess(mockUser);
    setShowAuthModal(false);
    onNavigateToStudio();
  };

  const triggerSocialLogin = (provider: 'Google' | 'Apple') => {
    const mockUser: User = {
      loggedIn: true,
      email: `${provider.toLowerCase()}User@archlab.vn`,
      name: `${provider} Designer`,
      role: 'Interior Designer',
      credits: 50
    };
    onAuthSuccess(mockUser);
    setShowAuthModal(false);
    onNavigateToStudio();
  };

  const handleCtaClick = () => {
    if (user.loggedIn) {
      onNavigateToStudio();
    } else {
      setAuthTab('signup');
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#00F2FE]/30 selection:text-[#00F2FE] relative">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* SECTION 1: TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0C10]/80 border-b border-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7F00FF] to-[#00F2FE] p-[1.5px] shadow-[0_0_15px_rgba(0,242,254,0.3)] animate-glow">
              <div className="w-full h-full bg-[#0B0C10] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#00F2FE]" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-[#FFFFFF] via-slate-100 to-[#00F2FE] bg-clip-text text-transparent">
                ArchLab <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-gradient-to-r from-[#7F00FF] to-[#00F2FE] text-white">POC</span>
              </span>
              <p className="text-[10px] text-[#A0AAB2] tracking-widest font-mono uppercase">AI Interior Studio</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#workflow" className="text-sm font-medium text-[#A0AAB2] hover:text-[#00F2FE] transition-colors duration-200">Workflow</a>
            <a href="#why" className="text-sm font-medium text-[#A0AAB2] hover:text-[#00F2FE] transition-colors duration-200">Tính năng</a>
            <a href="#performance" className="text-sm font-medium text-[#A0AAB2] hover:text-[#00F2FE] transition-colors duration-200">Hiệu năng</a>
            <a href="#showcase" className="text-sm font-medium text-[#A0AAB2] hover:text-[#00F2FE] transition-colors duration-200">Thư viện</a>
            <a href="#pricing" className="text-sm font-medium text-[#A0AAB2] hover:text-[#00F2FE] transition-colors duration-200">Bảng giá</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {user.loggedIn ? (
              <button 
                onClick={onNavigateToStudio}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-lg group bg-gradient-to-br from-[#7F00FF] to-[#00F2FE] text-white focus:outline-none"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#0B0C10] rounded-md group-hover:bg-opacity-0">
                  Vào Studio của bạn 🚀
                </span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => { setAuthTab('signin'); setShowAuthModal(true); }}
                  className="hidden sm:inline-block text-sm font-semibold text-[#A0AAB2] hover:text-[#FFFFFF] transition-colors duration-200 px-4 py-2"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }}
                  className="relative group inline-flex items-center justify-center px-5 py-2.5 overflow-hidden text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#7F00FF] to-[#00F2FE] hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all duration-300"
                >
                  <span>Dùng Thử Miễn Phí</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* SECTION 2: HERO SECTION (BEFORE / AFTER INTERACTIVE COMPARISON) */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden bg-radial-at-t from-[#16132b] via-[#0B0C10] to-[#0B0C10]">
        
        {/* Background glow flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7F00FF]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#00F2FE]/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero text */}
            <div className="lg:col-span-5 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#7F00FF]/10 to-[#00F2FE]/10 border border-[#00F2FE]/20 mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                <span className="text-xs font-semibold tracking-wide bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent font-mono uppercase">
                  Kiến Trúc & Nội Thất AI Thế Hệ Mới
                </span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
                ArchLab POC <br />
                <span className="bg-gradient-to-r from-[#00F2FE] via-[#00c6ff] to-[#7F00FF] bg-clip-text text-transparent">
                  AI Studio Render & Inpaint Đỉnh Cao
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#A0AAB2] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Đột phá quy trình thiết kế nội thất với Workflow 3 bước chuyên sâu: 
                <span className="text-white font-medium"> Generate Concept</span> — 
                <span className="text-white font-medium"> Layer Blend</span> — 
                <span className="text-white font-medium"> AI Inpaint</span>. 
                Kiểm soát hoàn toàn cấu trúc bản vẽ, thay đổi vật liệu chi tiết bằng AI cực mượt trong vài giây.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-black bg-[#00F2FE] hover:bg-[#00c6ff] transition-all duration-200 shadow-[0_4px_20px_rgba(0,242,254,0.3)] hover:scale-[1.02]"
                >
                  🚀 Bắt Đầu Render Ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={() => setVideoModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold text-[#FFFFFF] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                >
                  <Play className="w-4 h-4 mr-2 fill-white text-white" />
                  Xem Video Demo 1 Phút
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 border-t border-white/5 pt-8">
                <div>
                  <p className="text-2xl font-bold font-display text-white">99%</p>
                  <p className="text-xs text-[#A0AAB2]">Độ chính xác cấu trúc</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-bold font-display text-white">15s</p>
                  <p className="text-xs text-[#A0AAB2]">Render với Model Flash</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-bold font-display text-[#00F2FE]">50+</p>
                  <p className="text-xs text-[#A0AAB2]">Credits tặng miễn phí</p>
                </div>
              </div>

            </div>

            {/* Interactive Before/After image comparison slider */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl border border-white/10 bg-[#121318]/40 p-3 sm:p-4 backdrop-blur-md">
                
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#7F00FF] text-white text-[10px] font-bold rounded-full font-mono uppercase tracking-wider z-20 shadow-lg">
                  Trải nghiệm trực tiếp
                </div>

                <div 
                  ref={heroContainerRef}
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  {/* Left Side: Original Sketch (grayscale outline) */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" 
                      alt="Bản vẽ thô" 
                      className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-300">
                      ✏️ Bản vẽ 3D Trắng / Sketch Thô
                    </div>
                  </div>

                  {/* Right Side: AI Photorealistic Render (Sliding mask overlay) */}
                  <div 
                    className="absolute inset-0 overflow-hidden" 
                    style={{ clipPath: `polygon(${heroSliderPos}% 0, 100% 0, 100% 100%, ${heroSliderPos}% 100%)` }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80" 
                      alt="AI Render hoàn thiện" 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#7F00FF] to-[#00F2FE] px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg">
                      ✨ AI Render Siêu Thực (4K)
                    </div>
                  </div>

                  {/* Slider Divider Line */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-[#00F2FE] shadow-[0_0_10px_rgba(0,242,254,0.8)]"
                    style={{ left: `${heroSliderPos}%` }}
                  >
                    {/* Handle Button */}
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-[#00F2FE] flex items-center justify-center shadow-2xl cursor-ew-resize">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-3 border-r-2 border-[#00F2FE]"></div>
                        <div className="w-1.5 h-3 border-l-2 border-[#00F2FE]"></div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-[#A0AAB2] font-mono">
                  <span>← Kéo sang trái để xem bản vẽ thô</span>
                  <span>Kéo sang phải để xem AI Render →</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: THỰC TRẠNG & GIẢI PHÁP (WHY ARCHLAB?) */}
      <section id="why" className="py-24 border-t border-white/5 bg-[#121318]/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Nỗi Đau Trong Render Nội Thất 3D & Cách ArchLab Giải Quyết
            </h2>
            <p className="text-base text-[#A0AAB2]">
              Sự kết hợp hoàn hảo giữa sức mạnh AI và khả năng can thiệp kiểm soát đồ họa thủ công.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left: Pain Points */}
            <div className="bg-[#121318] rounded-2xl border border-red-900/20 p-8 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-900/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="font-display text-xl font-bold text-red-400 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-red-950/40 text-red-400 flex items-center justify-center mr-3 font-mono">⚠️</span>
                Quy trình render truyền thống & AI thông thường
              </h3>

              <ul className="space-y-4">
                {[
                  "Render 3D Max/SketchUp mất hàng tiếng đồng hồ cho mỗi góc chiếu.",
                  "Khách hàng đổi màu sofa, tủ hay chất liệu sàn -> Phải render lại từ đầu.",
                  "Dùng Midjourney/Stable Diffusion sinh ảnh ngẫu nhiên nhưng sai lệch 100% bố cục cửa sổ, dầm đà, tường ban đầu.",
                  "Lỗi mờ viền, răng cưa chất liệu giả tạo, không dùng được cho hồ sơ bản vẽ kỹ thuật."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-[#A0AAB2] leading-relaxed">
                    <span className="text-red-500 mr-3 mt-1 text-lg font-bold">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Solutions */}
            <div className="bg-[#121318] rounded-2xl border border-[#00F2FE]/20 p-8 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#00F2FE]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="font-display text-xl font-bold text-[#00F2FE] mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-[#00F2FE]/10 text-[#00F2FE] flex items-center justify-center mr-3 font-mono">✨</span>
                Giải pháp đột phá chuyên sâu từ ArchLab POC
              </h3>

              <ul className="space-y-4">
                {[
                  "Render cực nhanh: 15s với Model Flash để test nhanh, 45s với Model Pro ra ảnh chất lượng thực tế.",
                  "Hệ thống Layer Blend: Cho phép bạn tẩy xóa, khôi phục nét vẽ gốc để giữ nguyên khung dầm, cột, cửa kính sổ.",
                  "Chỉnh sửa Inpaint cục bộ: Bôi nhọ vùng tủ bếp, gõ 'oak wood cabinets' và AI tự động biến hình khu vực đó.",
                  "Edge Blend thông minh: Làm mịn đường biên vết vá 4px hoặc 8px giúp bức ảnh tàng hình hoàn hảo."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-[#A0AAB2] leading-relaxed">
                    <Check className="w-5 h-5 text-[#00F2FE] mr-3 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: WORKFLOW ĐỘC QUYỀN 3 BƯỚC */}
      <section id="workflow" className="py-24 bg-[#0B0C10] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-wider bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent font-mono uppercase">
              Tối Ưu Từng Giờ Làm Việc
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
              Quy Trình Sáng Tạo Nội Thất 3 Bước Độc Quyền
            </h2>
            <p className="text-base text-[#A0AAB2]">
              Sử dụng hệ thống tab tương tác trực tiếp để khám phá quy trình studio thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Vertical Tabs (Left side) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Tab 1 */}
              <button 
                onClick={() => setActiveWorkflowTab('b1')}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 workflow-step ${
                  activeWorkflowTab === 'b1' 
                    ? 'glass border-[#00F2FE]/40 bg-[#00F2FE]/5 shadow-[0_0_20px_rgba(0,242,254,0.15)]' 
                    : 'glass border-white/5 hover:border-[#00F2FE]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeWorkflowTab === 'b1' ? 'bg-[#00F2FE]/10 text-[#00F2FE]' : 'bg-white/5 text-gray-400'}`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg ${activeWorkflowTab === 'b1' ? 'text-white' : 'text-gray-300'}`}>
                        Bước 1: AI Generate Concept
                      </h3>
                      <p className="text-xs text-[#00F2FE] font-mono mt-0.5">Khởi tạo ý tưởng thần tốc</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-400">Step 1</span>
                </div>
                <p className="text-sm text-[#A0AAB2] mt-4 leading-relaxed">
                  Tải lên bản vẽ gốc, phác thảo hoặc ảnh phòng trống thô. AI sẽ tự động phân tích và render theo mood màu, phong cách chỉ định trong vài giây.
                </p>
              </button>

              {/* Tab 2 */}
              <button 
                onClick={() => setActiveWorkflowTab('b2')}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 workflow-step ${
                  activeWorkflowTab === 'b2' 
                    ? 'glass border-[#7F00FF]/40 bg-[#7F00FF]/5 shadow-[0_0_20px_rgba(127,0,255,0.15)]' 
                    : 'glass border-white/5 hover:border-[#7F00FF]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeWorkflowTab === 'b2' ? 'bg-[#7F00FF]/10 text-[#7F00FF]' : 'bg-white/5 text-gray-400'}`}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg ${activeWorkflowTab === 'b2' ? 'text-white' : 'text-gray-300'}`}>
                        Bước 2: Layer Blend
                      </h3>
                      <p className="text-xs text-[#7F00FF] font-mono mt-0.5">Kiểm soát tuyệt đối bố cục gốc</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-400">Step 2</span>
                </div>
                <p className="text-sm text-[#A0AAB2] mt-4 leading-relaxed">
                  Trộn lẫn ảnh vẽ thô và ảnh AI render bằng cơ chế opacity layer như Photoshop. Dùng cọ xóa thông minh bôi lộ bản vẽ kỹ thuật gốc để khớp kết cấu chuẩn 100%.
                </p>
              </button>

              {/* Tab 3 */}
              <button 
                onClick={() => setActiveWorkflowTab('b3')}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 workflow-step ${
                  activeWorkflowTab === 'b3' 
                    ? 'glass border-[#00F2FE]/40 bg-[#00F2FE]/5 shadow-[0_0_20px_rgba(0,242,254,0.15)]' 
                    : 'glass border-white/5 hover:border-[#00F2FE]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeWorkflowTab === 'b3' ? 'bg-[#00F2FE]/10 text-[#00F2FE]' : 'bg-white/5 text-gray-400'}`}>
                      <Paintbrush className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg ${activeWorkflowTab === 'b3' ? 'text-white' : 'text-gray-300'}`}>
                        Bước 3: AI Inpaint
                      </h3>
                      <p className="text-xs text-[#00F2FE] font-mono mt-0.5">Chỉnh sửa vật liệu cục bộ</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-400">Step 3</span>
                </div>
                <p className="text-sm text-[#A0AAB2] mt-4 leading-relaxed">
                  Bôi mặt nạ (masking) cọ đỏ lên vùng gỗ lát sàn, ghế sofa hay tủ bếp, gõ mô tả mong muốn. AI tự vá thay đổi tinh xảo mà không ảnh hưởng tới ánh sáng, không gian bên ngoài.
                </p>
              </button>

            </div>

            {/* Simulated Live Action Panel (Right side) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl border border-white/10 bg-[#121318] p-4 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between">
                
                {/* Header of simulated studio */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-xs font-mono text-gray-400 ml-2">archlab-poc-studio-v1.0.exe</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#00F2FE]/10 text-[#00F2FE] font-mono">
                    Mode: Interactive Simulation
                  </span>
                </div>

                {/* Content according to active step */}
                {activeWorkflowTab === 'b1' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-mono">Prompt: "phòng khách phong cách Nhật Bản tối giản, gỗ nhạt, ánh sáng tự nhiên dịu mát..."</span>
                        <span className="text-[10px] text-[#00F2FE] font-mono">Enhance AI ✓</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative rounded-lg overflow-hidden border border-white/5 aspect-video">
                          <img 
                            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" 
                            className="w-full h-full object-cover grayscale brightness-75"
                            alt="b1 sketch"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-xs bg-black/80 px-2 py-1 rounded border border-white/10 text-gray-300 font-mono">Sketch Tải Lên</span>
                          </div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden border border-[#00F2FE]/30 aspect-video group">
                          <img 
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" 
                            className="w-full h-full object-cover"
                            alt="b1 ai render"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-xs font-bold text-[#00F2FE]">✨ AI Concept Render</span>
                            <span className="text-[10px] text-gray-400 font-mono">Thời gian xử lý: 15.4s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FE] animate-ping"></div>
                        <span className="text-gray-300 font-medium">Render Engine: Model Flash (Fast Concept)</span>
                      </div>
                      <span className="text-[#00F2FE] font-bold">15 - 25 Giây</span>
                    </div>
                  </div>
                )}

                {activeWorkflowTab === 'b2' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-300">Trộn Lớp Layer Opacity:</span>
                        <span className="text-[#7F00FF] font-bold">60% AI Gen + 40% Sketch Gốc</span>
                      </div>
                      
                      <div className="relative rounded-lg overflow-hidden border border-white/5 aspect-video bg-black/60">
                        {/* Simulated mix of images using absolute stacking */}
                        <img 
                          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" 
                          className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
                          alt="base draw"
                          referrerPolicy="no-referrer"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" 
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                          alt="ai overlay"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Simulated Brush erasing mask visual */}
                        <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full border border-dashed border-[#7F00FF] bg-[#7F00FF]/10 flex items-center justify-center animate-pulse">
                          <Paintbrush className="w-6 h-6 text-[#7F00FF]" />
                        </div>
                        
                        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-gray-300 font-mono">
                          🔍 Brush bôi lộ nét vẽ gốc của cửa sổ kính
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-[#7F00FF]" />
                        <span className="text-gray-300">Chế độ: Eraser Brush & Opacity Layer Mixer</span>
                      </div>
                      <span className="text-[#7F00FF] font-bold">Giữ khung dầm cột 100%</span>
                    </div>
                  </div>
                )}

                {activeWorkflowTab === 'b3' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/20 flex items-center justify-between">
                        <span className="text-xs text-gray-300 font-mono">Bôi Cọ Đỏ Sofa -&gt; "thay sofa thành chất liệu da màu bò cognac sang trọng"</span>
                        <span className="text-[10px] text-yellow-400 font-mono">Edge Blend: 8px ✓</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative rounded-lg overflow-hidden border border-white/5 aspect-video">
                          <img 
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" 
                            className="w-full h-full object-cover"
                            alt="b3 mask base"
                            referrerPolicy="no-referrer"
                          />
                          {/* Simulated Mask overlay */}
                          <div className="absolute bottom-6 left-[40%] w-16 h-8 bg-red-600/60 rounded-full blur-sm flex items-center justify-center text-[10px] text-white font-bold border border-red-500">
                            Mask bôi đỏ
                          </div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden border border-white/5 aspect-video">
                          <img 
                            src="https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80" 
                            className="w-full h-full object-cover"
                            alt="b3 inpaint done"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-xs font-bold text-yellow-400">✨ AI Inpaint hoàn tất</span>
                            <span className="text-[10px] text-gray-400 font-mono">Sofa đã thay thành màu bò cognac</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-gray-300">Không làm lệch kết cấu phòng</span>
                      </div>
                      <span className="text-emerald-400 font-bold">Inpaint Edge Blended</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Call To Action Workflow */}
          <div className="mt-16 text-center">
            <button 
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold text-black bg-[#00F2FE] hover:bg-[#00c6ff] transition-all duration-200 hover:scale-[1.02]"
            >
              Thử Nghiệm Workflow Studio Ngay
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 5: HỆ SINH THÁI QUẢN LÝ CHUYÊN NGHIỆP (PROJECT & HISTORY) */}
      <section className="py-24 border-t border-white/5 bg-[#121318]/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual interface on the left */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-2xl border border-white/10 bg-[#121318] p-4 shadow-2xl">
                
                {/* Simulated file manager & Project list */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <LayoutGrid className="w-5 h-5 text-[#00F2FE]" />
                    <span className="text-sm font-semibold text-white">Quản lý Project & Lịch sử Tree</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  
                  {/* Left Column: Project Selector */}
                  <div className="col-span-4 border-r border-white/10 pr-4 space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">Thư Mục Dự Án</p>
                    <div className="p-2 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-xs font-medium text-white cursor-pointer">
                      📁 ComfyUI_temp_00026
                    </div>
                    <div className="p-2 rounded-lg hover:bg-white/5 text-xs text-gray-400 cursor-pointer transition-colors">
                      📁 Bếp Scandinavian
                    </div>
                    <div className="p-2 rounded-lg hover:bg-white/5 text-xs text-gray-400 cursor-pointer transition-colors">
                      📁 Cafe Sân Vườn AI
                    </div>
                    <div className="p-2 rounded-lg hover:bg-white/5 text-xs text-gray-400 cursor-pointer transition-colors">
                      📁 Penthouse Tân Cổ Điển
                    </div>
                  </div>

                  {/* Right Column: History timeline list */}
                  <div className="col-span-8 space-y-2 max-h-[220px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">History Tree</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#00F2FE] font-mono">Bản ghi: 6</span>
                    </div>

                    {[
                      { step: 'B3', title: 'B3 - Inpaint (Chỉnh Sofa)', time: '21:20', badge: 'bg-yellow-400/10 text-yellow-400' },
                      { step: 'B3', title: 'B3 - Inpaint (Thay sàn gỗ Sồi)', time: '21:18', badge: 'bg-yellow-400/10 text-yellow-400' },
                      { step: 'B2', title: 'B2 - Layer Blend (Giữ nét cửa)', time: '21:17', badge: 'bg-purple-400/10 text-purple-400' },
                      { step: 'B1', title: 'B1 - Generate Concept (Flash)', time: '21:16', badge: 'bg-cyan-400/10 text-cyan-400' },
                      { step: 'Original', title: 'Ảnh bản vẽ thô tải lên', time: '21:15', badge: 'bg-gray-400/10 text-gray-400' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5 text-xs hover:border-[#00F2FE]/30 transition-colors">
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${item.badge}`}>
                            {item.step}
                          </span>
                          <span className="text-gray-300 truncate font-medium">{item.title}</span>
                        </div>
                        <span className="text-gray-500 font-mono text-[10px]">{item.time}</span>
                      </div>
                    ))}

                  </div>

                </div>

              </div>
            </div>

            {/* Explanation on the right */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <span className="text-xs font-semibold tracking-wider bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent font-mono uppercase">
                Quản Trị Dự Án Thông Minh
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white tracking-tight mt-2 mb-6">
                Lịch Sử Phiên Bản Khoa Học — Không Sợ Mất Ý Tưởng
              </h2>
              <p className="text-[#A0AAB2] text-base leading-relaxed mb-6">
                Khác biệt hoàn toàn với các chatbot AI sinh ảnh rời rạc bị cuốn trôi mất. ArchLab tổ chức lưu trữ thông minh theo từng dự án làm việc riêng biệt.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-5 h-5 rounded bg-[#00F2FE]/10 text-[#00F2FE] flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-gray-300 ml-3">
                    <strong className="text-white">Bộ lọc thông minh (Filter History Tree):</strong> Dễ dàng lọc nhanh để xem lại ảnh gốc ban đầu, ảnh phác thảo ý tưởng B1, ảnh blend B2 hay inpaint B3.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 rounded bg-[#00F2FE]/10 text-[#00F2FE] flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-gray-300 ml-3">
                    <strong className="text-white">Dung lượng an toàn:</strong> Toàn bộ lịch sử các lớp layer được nén nhẹ nhàng, cho phép quay trở lại lấy asset cũ để blend lại phương án mới.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: BẢNG SO SÁNH HIỆU NĂNG (FLASH VS PRO MODEL) */}
      <section id="performance" className="py-24 bg-[#0B0C10] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-wider bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent font-mono uppercase">
              Hai Lõi AI Hiệu Suất Cao
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
              Dual-Engine: Tối Ưu Tốc Độ Hoặc Chất Lượng Ảnh
            </h2>
            <p className="text-base text-[#A0AAB2]">
              Lựa chọn động cơ thông minh phù hợp với mục đích gặp gỡ khách hàng hoặc chốt phương án thi công.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Model Flash Card */}
            <div className="bg-[#121318] rounded-2xl border border-white/5 p-8 relative overflow-hidden group hover:border-[#00F2FE]/40 transition-all duration-300">
              <div className="absolute top-0 right-0 px-4 py-1 bg-[#00F2FE]/20 text-[#00F2FE] text-xs font-bold font-mono uppercase tracking-wider rounded-bl-xl">
                ⚡ Tốc độ tối đa
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-[#00F2FE]/10 flex items-center justify-center text-[#00F2FE] mb-6">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">Model Flash</h3>
              <p className="text-xs text-[#00F2FE] font-mono mb-4">Concept Generator & Creative Mood</p>
              
              <div className="border-t border-white/5 pt-4 mb-6">
                <p className="text-3xl font-extrabold text-white font-display">15s — 25s</p>
                <p className="text-xs text-[#A0AAB2] mt-1">Thời gian xử lý trung bình mỗi ảnh</p>
              </div>

              <ul className="space-y-3 text-sm text-[#A0AAB2] mb-8">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-[#00F2FE] mr-2 shrink-0" />
                  <span>Cực kỳ tiết kiệm: Chỉ tốn 1 Credit mỗi lần render</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-[#00F2FE] mr-2 shrink-0" />
                  <span>Phù hợp để thảo luận tìm ý tưởng nhanh với chủ nhà</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-[#00F2FE] mr-2 shrink-0" />
                  <span>Sinh nhiều phương án mood màu đa dạng trong 1 phút</span>
                </li>
              </ul>
            </div>

            {/* Model Pro Card */}
            <div className="bg-[#121318] rounded-2xl border border-[#7F00FF]/20 p-8 relative overflow-hidden group hover:border-[#7F00FF]/40 transition-all duration-300 shadow-[0_4px_30px_rgba(127,0,255,0.05)]">
              <div className="absolute top-0 right-0 px-4 py-1 bg-[#7F00FF]/20 text-[#7F00FF] text-xs font-bold font-mono uppercase tracking-wider rounded-bl-xl">
                💎 Chất lượng tối thượng
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-[#7F00FF]/10 flex items-center justify-center text-[#7F00FF] mb-6">
                <Star className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">Model Pro</h3>
              <p className="text-xs text-[#7F00FF] font-mono mb-4">Photorealistic & Ultimate Details</p>
              
              <div className="border-t border-white/5 pt-4 mb-6">
                <p className="text-3xl font-extrabold text-white font-display">45s — 55s</p>
                <p className="text-xs text-[#A0AAB2] mt-1">Thời gian xử lý chi tiết cao cấp</p>
              </div>

              <ul className="space-y-3 text-sm text-[#A0AAB2] mb-8">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-[#7F00FF] mr-2 shrink-0" />
                  <span>Xử lý vật liệu siêu chính xác: Thớ gỗ, vân đá marble, phản chiếu kính</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-[#7F00FF] mr-2 shrink-0" />
                  <span>Đổ bóng vật lý 3 chiều, ánh sáng ấm áp, chuẩn ánh sáng mềm</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-[#7F00FF] mr-2 shrink-0" />
                  <span>Phù hợp để đưa vào tập tài liệu chốt phương án cuối</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 7: SHOWCASE GALLERY (INTERACTIVE HOVER COMPARISONS) */}
      <section id="showcase" className="py-24 border-t border-white/5 bg-[#121318]/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-wider bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent font-mono uppercase">
              Thư Viện Tác Phẩm Thực Tế
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
              Thư Viện Ý Tưởng Render Thực Tế
            </h2>
            <p className="text-base text-[#A0AAB2]">
              Rê chuột vào ảnh để tương tác Before/After so sánh giữa bản phác thảo thô và kết quả sinh ảnh của ArchLab.
            </p>
            
            {/* Category Filter Tags */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'living', label: 'Phòng khách & Ngủ' },
                { id: 'kitchen', label: 'Phòng Bếp' },
                { id: 'cafe', label: 'Quán Cafe' },
                { id: 'office', label: 'Văn phòng' }
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setShowcaseFilter(tag.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    showcaseFilter === tag.id
                      ? 'bg-gradient-to-r from-[#7F00FF] to-[#00F2FE] text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>

          {/* Grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowcase.map((item) => (
              <div 
                key={item.id} 
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#121318] p-2 aspect-[4/3] flex flex-col justify-end"
              >
                {/* Underneath Base Image (Before - Sketch) */}
                <img 
                  src={item.before} 
                  alt={item.title} 
                  className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-lg filter grayscale contrast-125"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Image (After - Render) reveals on hover */}
                <img 
                  src={item.after} 
                  alt={item.title} 
                  className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                  referrerPolicy="no-referrer"
                />

                {/* Top labels */}
                <div className="absolute top-4 left-4 z-10 flex space-x-1.5">
                  <span className="text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded border border-white/10 text-gray-300">
                    Sketch
                  </span>
                  <span className="text-[10px] font-mono bg-[#00F2FE] px-2 py-0.5 rounded text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    AI Render
                  </span>
                </div>

                {/* Info Overlay Panel */}
                <div className="relative z-10 p-3 bg-black/60 backdrop-blur-sm rounded-lg m-2 border border-white/5 transition-all group-hover:bg-[#0B0C10]/90">
                  <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                  <p className="text-[10px] text-[#A0AAB2] font-mono group-hover:text-[#00F2FE]">
                    Rê chuột vào để xem sự biến đổi kì diệu
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: PRICING TABLE (WHERE CRO ACTIVATION HAPPENS) */}
      <section id="pricing" className="py-24 bg-[#0B0C10] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold tracking-wider bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent font-mono uppercase">
              Bảng Giá Sử Dụng Linh Hoạt
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
              Chọn Gói Cước Tiết Kiệm Tối Ưu Nhất
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Gói = số tiền cấp vào ví user + ngày hiệu lực + giới hạn ảnh 1K/2K/4K + model cho phép. Gán/gia hạn gói cho user ở trang Người dùng
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-[#121318]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            
            {/* Search Input */}
            <div className="mb-6 relative max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input 
                type="text" 
                placeholder="Tìm gói theo tên..." 
                value={pricingSearch}
                onChange={(e) => setPricingSearch(e.target.value)}
                className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] transition-all"
              />
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-mono text-gray-500">
                    <th className="pb-4 font-semibold">Tên gói</th>
                    <th className="pb-4 font-semibold text-center">Hiệu lực</th>
                    <th className="pb-4 font-semibold text-center">Giới hạn ảnh</th>
                    <th className="pb-4 font-semibold text-right">Số tiền cấp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    {
                      id: 'trial',
                      name: 'Trial',
                      subtitle: '10 lượt dùng thử, hiệu lực 7 ngày',
                      duration: '7 ngày',
                      limit: '1K',
                      model: 'mọi model',
                      price: '0 VND'
                    },
                    {
                      id: 'starter',
                      name: 'Starter',
                      subtitle: '50 lượt tạo ảnh, hiệu lực 30 ngày',
                      duration: '30 ngày',
                      limit: '4K',
                      model: 'mọi model',
                      price: '300.000 VND'
                    },
                    {
                      id: 'pro',
                      name: 'Pro',
                      subtitle: '200 lượt tạo ảnh, hiệu lực 30 ngày',
                      duration: '30 ngày',
                      limit: '4K',
                      model: 'mọi model',
                      price: '1.000.000 VND'
                    },
                    {
                      id: 'vip',
                      name: 'VIP',
                      subtitle: 'Goi VIP test 9999 luot 365 ngay',
                      duration: '365 ngày',
                      limit: '4K',
                      model: 'mọi model',
                      price: '9.999.000 VND'
                    }
                  ]
                    .filter(pkg => 
                      pkg.name.toLowerCase().includes(pricingSearch.toLowerCase()) ||
                      pkg.subtitle.toLowerCase().includes(pricingSearch.toLowerCase())
                    )
                    .map((pkg) => (
                      <tr 
                        key={pkg.id} 
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={handleCtaClick}
                      >
                        {/* Tên gói */}
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                              {pkg.name}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              {pkg.subtitle}
                            </span>
                          </div>
                        </td>

                        {/* Hiệu lực */}
                        <td className="py-4 text-center">
                          <span className="text-xs font-semibold text-gray-200">
                            {pkg.duration}
                          </span>
                        </td>

                        {/* Giới hạn ảnh */}
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border ${
                              pkg.limit === '1K' 
                                ? 'bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/20' 
                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            }`}>
                              {pkg.limit}
                            </span>
                            <span className="text-xs text-gray-400">
                              {pkg.model}
                            </span>
                          </div>
                        </td>

                        {/* Số tiền cấp */}
                        <td className="py-4 text-right">
                          <span className="text-sm font-bold text-white group-hover:text-[#00F2FE] transition-colors font-mono">
                            {pkg.price}
                          </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination helper exactly like standard table */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-[11px] font-mono text-gray-500">
              <span>
                1-{
                  [
                    { name: 'Trial', subtitle: '10 lượt dùng thử, hiệu lực 7 ngày' },
                    { name: 'Starter', subtitle: '50 lượt tạo ảnh, hiệu lực 30 ngày' },
                    { name: 'Pro', subtitle: '200 lượt tạo ảnh, hiệu lực 30 ngày' },
                    { name: 'VIP', subtitle: 'Goi VIP test 9999 luot 365 ngay' }
                  ].filter(pkg => 
                    pkg.name.toLowerCase().includes(pricingSearch.toLowerCase()) ||
                    pkg.subtitle.toLowerCase().includes(pricingSearch.toLowerCase())
                  ).length
                } / {
                  [
                    { name: 'Trial', subtitle: '10 lượt dùng thử, hiệu lực 7 ngày' },
                    { name: 'Starter', subtitle: '50 lượt tạo ảnh, hiệu lực 30 ngày' },
                    { name: 'Pro', subtitle: '200 lượt tạo ảnh, hiệu lực 30 ngày' },
                    { name: 'VIP', subtitle: 'Goi VIP test 9999 luot 365 ngay' }
                  ].filter(pkg => 
                    pkg.name.toLowerCase().includes(pricingSearch.toLowerCase()) ||
                    pkg.subtitle.toLowerCase().includes(pricingSearch.toLowerCase())
                  ).length
                }
              </span>
              <span className="text-[10px] italic">
                Rê chuột và nhấp để kích hoạt gói cước
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 9: INTEGRATED AUTH SECTION (FOR SCROLLERS) */}
      <section className="py-24 bg-gradient-to-b from-[#0B0C10] to-[#121318] relative border-t border-white/5">
        <div className="max-w-md mx-auto px-4 sm:px-0">
          
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-mono rounded-full font-bold">
              🎁 Ưu Đãi Tạo Tài Khoản Mới
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3 mb-2">
              Khởi Tạo ArchLab Studio Ngay
            </h2>
            <p className="text-xs text-gray-400">Tặng ngay 50 credits để kiểm nghiệm thực tế 3 bước render AI</p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            
            {/* Form tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg mb-6">
              <button 
                onClick={() => { setAuthTab('signup'); setFormError(''); }}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${authTab === 'signup' ? 'bg-[#00F2FE] text-black font-bold shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Đăng Ký Tài Khoản
              </button>
              <button 
                onClick={() => { setAuthTab('signin'); setFormError(''); }}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${authTab === 'signin' ? 'bg-[#00F2FE] text-black font-bold shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Đăng Nhập
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-400 rounded-lg font-mono">
                  ⚠️ {formError}
                </div>
              )}

              {authTab === 'signup' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Họ và tên / Tên Studio</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Email công việc</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@studio.vn"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-gray-400">Mật khẩu</label>
                  {authTab === 'signin' && (
                    <a href="#" className="text-[10px] text-[#00F2FE] hover:underline">Quên mật khẩu?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authTab === 'signup' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Bạn hoạt động trong lĩnh vực?</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-black bg-opacity-30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="Interior Designer" className="bg-[#121318]">Kiến Trúc Sư Nội Thất</option>
                    <option value="Architect" className="bg-[#121318]">Kiến Trúc Sư Công Trình</option>
                    <option value="3D Artist" className="bg-[#121318]">Họa Viên 3D Artist</option>
                    <option value="Student" className="bg-[#121318]">Sinh Viên Kiến Trúc</option>
                    <option value="Owner/Other" className="bg-[#121318]">Khác / Chủ Nhà Tìm Ý Tưởng</option>
                  </select>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 px-4 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                {authTab === 'signup' ? 'Tạo Tài Khoản & Vào Studio' : 'Vào ArchLab Studio'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              {/* Social Logins */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative bg-[#121318] px-3 text-[10px] uppercase font-mono tracking-wider text-gray-500">Hoặc tiếp tục với</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => triggerSocialLogin('Google')}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.185 15.424 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.303-.177-1.859h-10.613z" />
                  </svg>
                  Google
                </button>
                <button 
                  type="button"
                  onClick={() => triggerSocialLogin('Apple')}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94 1.07.08 2.15-.52 2.81-1.33" />
                  </svg>
                  Apple
                </button>
              </div>

            </form>

          </div>

        </div>
      </section>

      {/* SECTION 10: FOOTER & SEO INFORMATION */}
      <footer className="bg-[#0B0C10] border-t border-white/10 py-16 text-[#A0AAB2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <span className="font-display font-bold text-xl text-white">ArchLab POC</span>
            <p className="text-xs leading-relaxed">
              Phần mềm AI render nội thất, Inpaint nội thất AI, Chỉnh sửa ảnh kiến trúc bằng AI chuyên sâu, được tin cậy bởi cộng đồng KTS Đông Nam Á.
            </p>
            <p className="text-xs text-gray-500">© 2026 ArchLab Studio. Bảo lưu mọi bản quyền.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">SEO Tags Ngữ Nghĩa</h4>
            <ul className="space-y-2 text-xs">
              <li>• Phần mềm AI render nội thất</li>
              <li>• Inpaint nội thất AI chuyên sâu</li>
              <li>• Chỉnh sửa ảnh kiến trúc bằng AI</li>
              <li>• Layer Blend Photoshop online</li>
              <li>• Tẩy xóa khôi phục ảnh AI</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tài Nguyên</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Học viện thiết kế AI</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cộng đồng Discord</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Hỗ trợ / Liên hệ</h4>
            <p className="text-xs leading-relaxed">
              Bạn có câu hỏi hoặc cần tư vấn sâu? Liên hệ đội ngũ KTS của chúng tôi:
            </p>
            <p className="text-xs text-white font-mono mt-2">📧 support@archlab.vn</p>
            <p className="text-xs text-white font-mono">📞 1900-9999-99 (Hotline 24/7)</p>
          </div>

        </div>
      </footer>

      {/* WATCH VIDEO DEMO MODAL POPUP */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#121318] rounded-2xl border border-white/10 p-2 overflow-hidden shadow-2xl">
            <button 
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-lg font-bold"
            >
              ×
            </button>
            
            {/* Standard responsive player simulation wrapper */}
            <div className="aspect-video bg-black rounded-lg flex flex-col items-center justify-center">
              <Sparkles className="w-16 h-16 text-[#00F2FE] mb-4 animate-bounce" />
              <p className="text-sm text-gray-300 font-medium mb-1">Mô phỏng Video Demo: Quy trình 3 bước tại Studio</p>
              <p className="text-xs text-[#A0AAB2] px-6 text-center max-w-md">
                B1: Nhập Prompt render ảnh concept phác thảo trong 15s. <br />
                B2: Dùng cọ lột mặt nạ giữ nguyên kết cấu bản vẽ. <br />
                B3: Bôi đỏ sofa thay thế chất liệu mượt mà.
              </p>
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="mt-6 px-4 py-2 bg-[#00F2FE] text-black text-xs font-bold rounded-lg"
              >
                Đã hiểu, đóng video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH POPUP MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-[#121318]/95 rounded-2xl border border-white/10 p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.15)] animate-glow">
            
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 bg-black/60 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:text-white hover:bg-white/10 text-lg font-semibold"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-[#00F2FE]/10 text-[#00F2FE] text-[10px] font-mono rounded-full font-bold">
                🎁 Quà tặng khởi đầu 50 Credits
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-3">
                {authTab === 'signup' ? 'Tham Gia ArchLab Studio' : 'Vui Lòng Đăng Nhập'}
              </h3>
            </div>

            {/* Form inside popup modal */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-400 rounded-lg font-mono">
                  ⚠️ {formError}
                </div>
              )}

              {authTab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Họ và tên / Studio</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Email công việc</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@studio.vn"
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-mono uppercase text-gray-400">Mật khẩu</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authTab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Bạn hoạt động trong lĩnh vực?</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black bg-opacity-30 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE]"
                  >
                    <option value="Interior Designer" className="bg-[#121318]">Kiến Trúc Sư Nội Thất</option>
                    <option value="Architect" className="bg-[#121318]">Kiến Trúc Sư Công Trình</option>
                    <option value="3D Artist" className="bg-[#121318]">Họa Viên 3D Artist</option>
                    <option value="Student" className="bg-[#121318]">Sinh Viên Kiến Trúc</option>
                  </select>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] hover:opacity-90"
              >
                {authTab === 'signup' ? 'Tạo Tài Khoản & Vào Studio' : 'Vào ArchLab Studio'}
              </button>

              <div className="text-center text-[10px] mt-4">
                {authTab === 'signup' ? (
                  <p className="text-gray-400">
                    Đã có tài khoản?{' '}
                    <button type="button" onClick={() => setAuthTab('signin')} className="text-[#00F2FE] hover:underline font-bold">Đăng nhập</button>
                  </p>
                ) : (
                  <p className="text-gray-400">
                    Chưa có tài khoản?{' '}
                    <button type="button" onClick={() => setAuthTab('signup')} className="text-[#00F2FE] hover:underline font-bold">Đăng ký mới</button>
                  </p>
                )}
              </div>

              {/* Social login buttons inside popup */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative bg-[#121318] px-2.5 text-[9px] uppercase font-mono tracking-wider text-gray-500">Hoặc tiếp tục với</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => triggerSocialLogin('Google')}
                  className="flex items-center justify-center py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white"
                >
                  Google
                </button>
                <button 
                  type="button"
                  onClick={() => triggerSocialLogin('Apple')}
                  className="flex items-center justify-center py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white"
                >
                  Apple
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
