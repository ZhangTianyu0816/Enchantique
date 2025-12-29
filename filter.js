document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 1. 视觉增强逻辑 ==========

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));


    // ========== 2. 产品筛选与画廊逻辑 ==========

    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // 筛选逻辑
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const isDefaultShow = card.classList.contains('default-show');

                card.style.animation = 'none';
                void card.offsetHeight; 
                card.style.animation = 'fadeUp 0.5s ease forwards';

                if (filterValue === 'all') {
                    card.style.display = isDefaultShow ? 'block' : 'none';
                } else {
                    card.style.display = (cardCategory === filterValue && !isDefaultShow) ? 'block' : 'none';
                }
            });
        });
    });

    // --- 图片画廊与预览 ---
    const previewModal = document.getElementById('imgPreviewModal');
    const previewImg = document.getElementById('previewImg');
    const modalPrevBtn = document.querySelector('.modal-prev');
    const modalNextBtn = document.querySelector('.modal-next');
    const closePreviewBtn = document.getElementById('closePreviewBtn');

    let currentGalleryImages = [];
    let currentGalleryIndex = 0;

    function updateModalImage() {
        if (currentGalleryImages.length > 0) {
            previewImg.style.opacity = '0';
            setTimeout(() => {
                previewImg.setAttribute('src', currentGalleryImages[currentGalleryIndex]);
                previewImg.style.opacity = '1';
            }, 200);
            
            const showNav = currentGalleryImages.length > 1;
            if(modalPrevBtn) modalPrevBtn.style.display = showNav ? 'block' : 'none';
            if(modalNextBtn) modalNextBtn.style.display = showNav ? 'block' : 'none';
        }
    }

    if (closePreviewBtn) closePreviewBtn.onclick = () => {
        previewModal.style.display = 'none';
        document.body.style.overflow = '';
    };

    if (modalPrevBtn) modalPrevBtn.onclick = (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateModalImage();
    };

    if (modalNextBtn) modalNextBtn.onclick = (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
        updateModalImage();
    };

    // 初始化所有卡片的内部切换逻辑
    document.querySelectorAll('.product-img').forEach(container => {
        const imgElement = container.querySelector('img');
        const prevBtn = container.querySelector('.img-nav-btn.prev');
        const nextBtn = container.querySelector('.img-nav-btn.next');
        const panels = container.querySelectorAll('.product-detail-panel');

        let images = [];
        if (container.getAttribute('data-gallery')) {
            images = container.getAttribute('data-gallery').split(',');
        } else {
            images = [imgElement.getAttribute('src')];
        }

        let cardIndex = 0;

        function updateCardDisplay(index) {
            // 切换图片
            imgElement.style.opacity = 0.5;
            setTimeout(() => {
                imgElement.setAttribute('src', images[index]);
                imgElement.style.opacity = 1;
            }, 150);

            // 同步切换详情面板 (针对天津地标系列)
            if (panels.length > 0) {
                panels.forEach((p, i) => p.classList.toggle('active', i === index));
            }
        }

        if (prevBtn) {
            prevBtn.style.display = images.length > 1 ? 'flex' : 'none';
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                cardIndex = (cardIndex - 1 + images.length) % images.length;
                updateCardDisplay(cardIndex);
            };
        }

        if (nextBtn) {
            nextBtn.style.display = images.length > 1 ? 'flex' : 'none';
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                cardIndex = (cardIndex + 1) % images.length;
                updateCardDisplay(cardIndex);
            };
        }

        // 点击图片放大预览
        container.onclick = (e) => {
            if (e.target.closest('.img-nav-btn')) return;
            currentGalleryImages = images;
            currentGalleryIndex = cardIndex;
            updateModalImage();
            previewModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
    });

    // ========== 3. 其他功能 (门店/视频等) ==========

    // 线下门店筛选
    const cityBtns = document.querySelectorAll('.city-btn');
    const cityStoresContainers = document.querySelectorAll('.city-stores');

    cityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cityFilter = btn.getAttribute('data-city');
            cityStoresContainers.forEach(container => {
                container.style.display = container.getAttribute('data-city') === cityFilter ? 'block' : 'none';
            });
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
    const activeBtn = document.querySelector('.city-btn.active');
    if (activeBtn) {
        const initialCity = activeBtn.getAttribute('data-city');
        switchCity(initialCity);
    }
    });
    // 视频弹窗
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoIcons = document.querySelectorAll('.video-icon');

    videoIcons.forEach(icon => {
        icon.onclick = function(e) {
            e.stopPropagation();
            const videoSrc = this.getAttribute('data-video-src');
            if (videoSrc) {
                modalVideo.src = videoSrc;
                videoModal.classList.add('show');
                videoModal.style.visibility = 'visible';
                videoModal.style.opacity = '1';
                modalVideo.play();
            }
        };
    });

    window.closeVideoModal = function() {
        videoModal.style.opacity = '0';
        setTimeout(() => {
            videoModal.classList.remove('show');
            videoModal.style.visibility = 'hidden';
            modalVideo.pause();
            modalVideo.src = '';
        }, 300);
    };

    if (document.getElementById('videoModalClose')) {
        document.getElementById('videoModalClose').onclick = closeVideoModal;
    }

    // 回到顶部
    const sideMenu = document.getElementById('sideMenu');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) sideMenu.classList.add('show');
        else sideMenu.classList.remove('show');
    });

    const backToTopBtn = document.getElementById('backToTopBtn');
    if(backToTopBtn) backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
});


document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuPopup = document.getElementById('mobileMenuPopup');

    if (mobileMenuBtn && mobileMenuPopup) {
        mobileMenuBtn.addEventListener('click', function() {
            // 切换菜单弹窗的显示状态
            mobileMenuPopup.classList.toggle('show');
        });

        // 可选：点击菜单外部关闭弹窗
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenuPopup.contains(e.target)) {
                mobileMenuPopup.classList.remove('show');
            }
        });
    }
});