/**
 * DIGITAL E-CV — SCRIPT INTERAKSI & NAVIGASI
 * Dibuat untuk proyek akademik mahasiswa Sistem Informasi
 * Menggunakan Vanilla JavaScript murni tanpa dependensi eksternal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. ELEMEN DOM UTAMA
  // -------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const currentYearSpan = document.getElementById('currentYear');
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // Set tahun otomatis pada footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. STICKY NAVBAR SCROLL DETECTOR
  // -------------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Cek awal saat halaman dimuat

  // -------------------------------------------------------------------------
  // 3. MOBILE HAMBURGER MENU (RESPONSIF)
  // -------------------------------------------------------------------------
  const toggleMobileMenu = (forceClose = false) => {
    if (!navMenu || !navToggle) return;
    const isOpen = forceClose ? false : !navMenu.classList.contains('is-open');

    if (isOpen) {
      navMenu.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Tutup menu navigasi');
    } else {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Buka menu navigasi');
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Tutup menu mobile ketika klik di luar navbar
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('is-open')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  // Tutup menu mobile dengan tombol ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('is-open')) {
        toggleMobileMenu(true);
      }
      closeProjectModal();
    }
  });

  // -------------------------------------------------------------------------
  // 4. INTERSECTION OBSERVER UNTUK ACTIVE NAVBAR
  // Mendeteksi bagian halaman yang sedang terlihat saat scroll normal
  // -------------------------------------------------------------------------
  let isManualScrolling = false;
  let scrollTimeout = null;

  const setActiveNavLink = (targetId) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };

  // Konfigurasi Intersection Observer
  // rootMargin: Mendeteksi saat bagian section masuk ke area pandang atas
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    if (isManualScrolling) return; // Jangan override jika user sedang klik menu

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveNavLink(id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // -------------------------------------------------------------------------
  // 5. SMOOTH SCROLLING DENGAN OFFSET NAVBAR
  // -------------------------------------------------------------------------
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        e.preventDefault();

        // Tandai aktif langsung
        setActiveNavLink(targetId);

        // Kunci sementara observer agar tidak flickering
        isManualScrolling = true;
        clearTimeout(scrollTimeout);

        // Scroll mulus dengan CSS scroll-margin-top
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Tutup menu mobile jika sedang terbuka
        toggleMobileMenu(true);

        // Buka kembali observer setelah animasi scroll selesai
        scrollTimeout = setTimeout(() => {
          isManualScrolling = false;
        }, 850);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. MODAL DETAIL PROYEK
  // -------------------------------------------------------------------------
  const projectData = {
    'proj-1': {
      title: 'Sistem Informasi Pembelajaran Informasi Teknologi',
      category: 'RUMAH IT • MEDIA EDUKASI INTERAKTIF',
      overview: 'Web pembelajaran teknologi informasi dan komputer untuk semua kalangan mulai dari pemula hingga mahir, dengan materi yang lengkap dan mudah dipahami dalam bentuk visual novel beserta karakter yang interaktif.',
      challenge: 'Penyampaian materi konsep teknologi informasi sering kali terasa kaku dan monoton jika hanya berupa teks teori konvensional, sehingga menurunkan minat belajar mahasiswa dan pemula.',
      solution: 'Merancang antarmuka pembelajaran berbasis visual novel interaktif dengan ilustrasi karakter responsif, alur cerita terstruktur, navigasi materi bertahap, dan visualisasi materi yang menarik.',
      technologies: ['HTML5 Semantik', 'CSS3 Modern', 'JavaScript ES6', 'Interactive Storytelling', 'UI/UX Design']
    },
    'proj-2': {
      title: 'Sistem Inventaris dan Manajemen Stok Obat',
      category: 'MEDILOG • LOGISTIK & MANAJEMEN APOTEK',
      overview: 'Sistem informasi pengelolaan persediaan dan sirkulasi obat terpusat untuk memantau stok obat masuk, peringatan tanggal kedaluwarsa, serta alur pengeluaran resep secara akurat.',
      challenge: 'Pencatatan konvensional rawan menimbulkan selisih stok fisik, keterlambatan identifikasi obat kedaluwarsa, dan kesulitan dalam pelaporan sirkulasi barang berkala.',
      solution: 'Mengimplementasikan sistem pencatatan terstruktur dengan notifikasi otomatis stok minimum, pengelompokan batch kedaluwarsa, dan validasi transaksi distribusi obat.',
      technologies: ['HTML5', 'CSS Grid', 'JavaScript ES6', 'MySQL Relasional', 'BPMN 2.0']
    },
    'proj-3': {
      title: 'Dashboard Analisis Penjualan & Bisnis',
      category: 'Data Analytics & Business Intelligence',
      overview: 'Dasbor analitik interaktif yang menyajikan metrik performa bisnis penting (KPI), tren produk terlaris, segmentasi pelanggan, serta perbandingan target pendapatan tahunan.',
      challenge: 'Manajemen membutuhkan visualisasi ringkas yang mudah dipahami dalam hitungan detik tanpa harus mengolah tabel data mentah secara manual.',
      solution: 'Menghubungkan visualisasi data grafis interaktif dengan filter rentang waktu dinamis, kartu metrik ringkasan otomatis, dan tata letak dasbor modern yang adaptif di berbagai resolusi layar.',
      technologies: ['Data Visualization', 'CSS Grid System', 'JavaScript Analytics', 'SQL Queries', 'UI/UX Design']
    }
  };

  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalOverview = document.getElementById('modalOverview');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalSolution = document.getElementById('modalSolution');
  const modalTechStack = document.getElementById('modalTechStack');

  window.openProjectModal = (projectId) => {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalOverview.textContent = data.overview;
    modalChallenge.textContent = data.challenge;
    modalSolution.textContent = data.solution;

    modalTechStack.innerHTML = '';
    data.technologies.forEach((tech) => {
      const span = document.createElement('span');
      span.className = 'project-tag';
      span.textContent = tech;
      modalTechStack.appendChild(span);
    });

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Kunci scroll latar belakang
    if (modalCloseBtn) modalCloseBtn.focus();
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. FORMULIR KONTAK (CLIENT-SIDE INTERAKTIF VIA MAILTO)
  // Tidak memerlukan backend server atau database
  // -------------------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        alert('Mohon lengkapi nama, email, dan pesan Anda.');
        return;
      }

      // Ambil nama profil secara dinamis
      const profileNameEl = document.querySelector('.hero-name');
      const recipientName = profileNameEl ? profileNameEl.textContent.replace('Halo, Saya', '').trim() : 'Pemilik CV';

      // Format body pesan untuk mailto
      const formattedSubject = encodeURIComponent(`[Portofolio E-CV] ${subject || 'Pesan Baru'}`);
      const formattedBody = encodeURIComponent(
        `Halo ${recipientName},\n\nNama: ${name}\nEmail Pengirim: ${email}\n\nPesan:\n${message}\n\n---\nDikirim melalui formulir Digital E-CV`
      );

      // Tampilkan feedback positif kepada pengguna
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `
          <div style="background: #E6F7F9; border: 1px solid #0CA9B7; color: #088a96; padding: 12px 16px; border-radius: 8px; font-size: 0.88rem; margin-top: 14px;">
            <strong>Membuka Aplikasi Email Anda...</strong><br>
            Karena website ini statis, aplikasi email Anda (seperti Outlook, Gmail, atau Mail) akan terbuka dengan draf pesan yang sudah terisi. Anda tinggal menekan tombol Kirim!
          </div>
        `;
      }

      // Buka email client pengguna
      setTimeout(() => {
        window.location.href = `mailto:ahmad.fajar@example.com?subject=${formattedSubject}&body=${formattedBody}`;
      }, 400);
    });
  }

  // -------------------------------------------------------------------------
  // 8. PENGUJIAN DOWNLOAD CV
  // Memastikan aksi download berjalan mulus
  // -------------------------------------------------------------------------
  const downloadBtn = document.getElementById('downloadCvBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      // Tombol langsung mengunduh assets/files/cv.pdf melalui atribut download
      console.log('Mengunduh CV PDF: assets/files/cv.pdf');
    });
  }

  // -------------------------------------------------------------------------
  // 9. SCROLL REVEAL ANIMATIONS (OPSI A: MUNCUL SETIAP KALI SCROLL)
  // Elemen akan otomatis beranimasi setiap kali masuk ke viewport, dan di-reset
  // saat keluar dari viewport (sehingga selalu muncul berulang saat scroll naik/turun).
  // -------------------------------------------------------------------------
  const revealTargetSelectors = [
    '.section-header',
    '.hero-content',
    '.hero-visual',
    '.about-text-card',
    '.about-persona-stage',
    '.about-slideshow-card',
    '.skill-category-card',
    '.timeline-card',
    '.project-showcase-stage',
    '.project-card',
    '.education-card',
    '.cert-card',
    '.contact-card',
    '.contact-form-card'
  ];

  // Inisialisasi class reveal dan staggered delay otomatis
  revealTargetSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add('reveal');
      }

      // Deteksi jika elemen berada di dalam grid grup untuk memberikan staggered delay
      const parent = el.parentElement;
      if (parent && (
        parent.classList.contains('skills-grid') || 
        parent.classList.contains('projects-grid') || 
        parent.classList.contains('cert-grid') || 
        parent.classList.contains('contact-info-cards')
      )) {
        const childIndex = Array.from(parent.children).indexOf(el);
        const staggerClass = `stagger-${(childIndex % 5) + 1}`;
        el.classList.add(staggerClass);
      }
    });
  });

  // Konfigurasi IntersectionObserver khusus Opsi A (Re-trigger setiap scroll)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Elemen masuk area pandang -> Tambahkan kelas 'is-visible' untuk memicu animasi muncul
        entry.target.classList.add('is-visible');
      } else {
        // OPSI A: Elemen keluar area pandang -> Hapus kelas 'is-visible'
        // Dengan begitu, animasi akan terulang kembali saat digulir kembali ke elemen ini!
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px', // Memicu animasi sedikit sebelum elemen tepat menyentuh dasar layar
    threshold: 0.12 // 12% bagian elemen terlihat di layar
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // -------------------------------------------------------------------------
  // 10. SLIDESHOW OTOMATIS SECTION ABOUT (SETIAP 5 DETIK & GESER KIRI)
  // Khusus dirancang untuk gambar persona PNG transparan ala Stella Sora
  // -------------------------------------------------------------------------
  const personaStage = document.getElementById('personaStage') || document.getElementById('aboutSlideshow');
  if (personaStage) {
    const slides = personaStage.querySelectorAll('.persona-slide, .slide-item');
    const dots = personaStage.querySelectorAll('.slideshow-dots .dot');
    const prevBtn = document.getElementById('slidePrevBtn');
    const nextBtn = document.getElementById('slideNextBtn');
    const progressFill = document.getElementById('slideProgressFill');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 5000; // 5 Detik per persona / gambar
    let progressInterval = null;
    let progressStartTime = 0;
    let isPaused = false;

    // Fungsi perpindahan slide dengan efek memudar & geser ke kiri
    function goToSlide(nextIndex) {
      if (nextIndex === currentIndex || nextIndex < 0 || nextIndex >= totalSlides) return;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];

      // Slide aktif saat ini: Memudar sembari geser ke kiri
      currentSlide.classList.remove('active');
      currentSlide.classList.add('slide-out-left');

      // Hapus kelas slide-out-left setelah durasi animasi selesai (850ms)
      setTimeout(() => {
        currentSlide.classList.remove('slide-out-left');
      }, 850);

      // Slide berikutnya: Masuk dari kanan ke tengah sambil memudar masuk
      nextSlide.classList.add('active');

      // Perbarui status dots indikator
      dots.forEach((dot, idx) => {
        if (idx === nextIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      currentIndex = nextIndex;
      resetProgressBar();
    }

    function nextSlide() {
      const next = (currentIndex + 1) % totalSlides;
      goToSlide(next);
    }

    function prevSlide() {
      const prev = (currentIndex - 1 + totalSlides) % totalSlides;
      goToSlide(prev);
    }

    // Animasi Progress Bar 5 Detik
    function startProgressBar() {
      if (progressInterval) clearInterval(progressInterval);
      progressStartTime = Date.now();

      progressInterval = setInterval(() => {
        if (isPaused) return;

        const elapsed = Date.now() - progressStartTime;
        const percent = Math.min((elapsed / slideDuration) * 100, 100);
        if (progressFill) {
          progressFill.style.width = `${percent}%`;
        }

        if (elapsed >= slideDuration) {
          clearInterval(progressInterval);
          nextSlide();
        }
      }, 40);
    }

    function resetProgressBar() {
      if (progressFill) {
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        setTimeout(() => {
          progressFill.style.transition = 'width 0.04s linear';
          startProgressBar();
        }, 40);
      } else {
        startProgressBar();
      }
    }

    // Jalankan timer pertama kali
    startProgressBar();

    // Tombol Panah Manual
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
    }

    // Klik Dots Indikator
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(targetIdx);
      });
    });

    // Jeda perputaran saat kursor mouse berada di atas gambar (Pause on Hover)
    personaStage.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    personaStage.addEventListener('mouseleave', () => {
      isPaused = false;
    });
  }

  // -------------------------------------------------------------------------
  // 11. SHOWCASE PROYEK SATU PER SATU DENGAN NAVIGASI PANAH
  // Menampilkan satu proyek dalam kontainer besar dengan tombol panah & titik
  // -------------------------------------------------------------------------
  const projectStage = document.getElementById('projectShowcaseStage');
  if (projectStage) {
    const projectSlides = projectStage.querySelectorAll('.project-slide-item');
    const projectDots = projectStage.querySelectorAll('.project-dots-group .proj-dot');
    const projPrevBtn = document.getElementById('projPrevBtn');
    const projNextBtn = document.getElementById('projNextBtn');
    const projCurrentNum = document.getElementById('projCurrentNum');

    let currentProjIdx = 0;
    const totalProjects = projectSlides.length;
    let isTransitioning = false;

    function goToProject(nextIdx) {
      if (nextIdx === currentProjIdx || nextIdx < 0 || nextIdx >= totalProjects || isTransitioning) return;
      isTransitioning = true;

      const currentSlide = projectSlides[currentProjIdx];
      const nextSlide = projectSlides[nextIdx];

      // Animasi slide keluar
      currentSlide.classList.remove('active');
      currentSlide.classList.add('slide-out-left');

      setTimeout(() => {
        currentSlide.classList.remove('slide-out-left');
      }, 600);

      // Slide tujuan masuk
      nextSlide.classList.add('active');

      // Update dots indikator
      projectDots.forEach((dot, idx) => {
        if (idx === nextIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Update counter text (01, 02, 03)
      if (projCurrentNum) {
        projCurrentNum.textContent = String(nextIdx + 1).padStart(2, '0');
      }

      currentProjIdx = nextIdx;

      setTimeout(() => {
        isTransitioning = false;
      }, 620);
    }

    function nextProject() {
      const next = (currentProjIdx + 1) % totalProjects;
      goToProject(next);
    }

    function prevProject() {
      const prev = (currentProjIdx - 1 + totalProjects) % totalProjects;
      goToProject(prev);
    }

    if (projNextBtn) {
      projNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextProject();
      });
    }

    if (projPrevBtn) {
      projPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevProject();
      });
    }

    // Klik indikator dots
    projectDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
        goToProject(targetIdx);
      });
    });

    // Navigasi keyboard tombol panah kiri / kanan jika berada di section proyek
    window.addEventListener('keydown', (e) => {
      const projectsSection = document.getElementById('projects');
      if (!projectsSection) return;
      const rect = projectsSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowRight') {
          nextProject();
        } else if (e.key === 'ArrowLeft') {
          prevProject();
        }
      }
    });

    // Dukungan gesture swipe di layar sentuh perangkat mobile
    let touchStartX = 0;
    let touchEndX = 0;

    projectStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    projectStage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          nextProject(); // Swipe ke kiri -> Next
        } else {
          prevProject(); // Swipe ke kanan -> Prev
        }
      }
    }, { passive: true });
  }
});

