'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Verify path
import { getUserLikedPhotoIds, toggleLike, getPhotoLikes } from '@/lib/galleries';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import TagFilter from './TagFilter';
import SearchBar from './SearchBar';
import LikesListModal from './LikesListModal';
import styles from './GalleryGrid.module.css';


export default function GalleryGrid({ photos }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { user } = useAuth();
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [activeTag, setActiveTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Likes State
    const [likedPhotoIds, setLikedPhotoIds] = useState(new Set());
    const [likeCounts, setLikeCounts] = useState({});
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likesModalUsers, setLikesModalUsers] = useState([]);
    const [loadingLikes, setLoadingLikes] = useState(false);

    // Initialize counts from photos
    useEffect(() => {
        if (photos) {
            const counts = {};
            photos.forEach(p => {
                counts[p.id] = p.likes || 0;
            });
            setLikeCounts(counts);
        }
    }, [photos]);

    // Fetch user liked photos
    useEffect(() => {
        const fetchLikes = async () => {
            if (user) {
                const ids = await getUserLikedPhotoIds(user.id);
                setLikedPhotoIds(new Set(ids));
            } else {
                setLikedPhotoIds(new Set());
            }
        };
        fetchLikes();
    }, [user]);

    const handleLikeToggle = async (photo) => {
        if (!user) {
            router.push('/login'); // Redirect to login
            return;
        }

        const isLiked = likedPhotoIds.has(photo.id);

        // Optimistic update
        const newLikedIds = new Set(likedPhotoIds);
        const newCounts = { ...likeCounts };

        if (isLiked) {
            newLikedIds.delete(photo.id);
            newCounts[photo.id] = Math.max(0, (newCounts[photo.id] || 0) - 1);
        } else {
            newLikedIds.add(photo.id);
            newCounts[photo.id] = (newCounts[photo.id] || 0) + 1;
        }

        setLikedPhotoIds(newLikedIds);
        setLikeCounts(newCounts);

        try {
            await toggleLike(photo.id, user.id);
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error
            setLikedPhotoIds(likedPhotoIds);
            setLikeCounts(likeCounts);
        }
    };

    const handleShowLikes = async (photo) => {
        setLoadingLikes(true);
        setShowLikesModal(true);
        setLikesModalUsers([]); // Clear previous

        try {
            const users = await getPhotoLikes(photo.id);
            setLikesModalUsers(users);
        } catch (error) {
            console.error('Error getting likes list:', error);
            setLikesModalUsers([]);
        } finally {
            setLoadingLikes(false);
        }
    };


    // Sync URL with selection
    useEffect(() => {
        const photoId = searchParams.get('photo');
        if (photoId && photos) {
            const photo = photos.find(p => p.id.toString() === photoId);
            if (photo) {
                setSelectedPhoto(photo);
            }
        } else {
            setSelectedPhoto(null);
        }
    }, [searchParams, photos]);

    const handlePhotoSelect = (photo) => {
        const params = new URLSearchParams(searchParams);
        if (photo) {
            params.set('photo', photo.id);
        } else {
            params.delete('photo');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (!photos || photos.length === 0) {
        return <p className={styles.empty}>No hay fotos publicadas aún.</p>;
    }

    // Extract unique tags and clean them
    const tags = Array.from(new Set(
        photos
            .map(p => p.eventTag?.trim())
            .filter(tag => tag && tag.length > 0)
    )).sort();

    // Filter photos based on active tag AND search query
    const filteredPhotos = useMemo(() => {
        let results = photos || [];

        // 1. Filter by active tag
        if (activeTag) {
            results = results.filter(p => p.eventTag?.trim() === activeTag);
        }

        // 2. Filter by search query (tag, author, caption)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            results = results.filter(p =>
                (p.eventTag && p.eventTag.toLowerCase().includes(q)) ||
                (p.author && p.author.toLowerCase().includes(q)) ||
                (p.caption && p.caption.toLowerCase().includes(q))
            );
        }

        return results;
    }, [photos, activeTag, searchQuery]);

    return (
        <>
            <SearchBar onSearch={setSearchQuery} />

            {tags.length > 0 && (
                <TagFilter
                    tags={tags}
                    activeTag={activeTag}
                    onTagChange={(tag) => {
                        setActiveTag(tag);
                        // Optional: clear search when picking a tag? 
                        // Usually better to keep both for additive filtering.
                    }}
                />
            )}

            <div className={styles.grid}>
                {filteredPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        onClick={() => handlePhotoSelect(photo)}
                        style={{ cursor: 'pointer' }}
                    >
                        <PhotoCard
                            photo={{
                                ...photo,
                                likes: likeCounts[photo.id] ?? photo.likes ?? 0
                            }}
                            isLiked={likedPhotoIds.has(photo.id)}
                            onLikeToggle={(e) => {
                                e.stopPropagation(); // Prevent opening lightbox
                                handleLikeToggle(photo);
                            }}
                            onShowLikes={(e) => {
                                e.stopPropagation();
                                handleShowLikes(photo);
                            }}
                            currentUser={user}
                        />

                    </div>
                ))}
            </div>

            {filteredPhotos.length === 0 && activeTag && (
                <p className={styles.empty}>No hay fotos para el tag #{activeTag}.</p>
            )}

            {selectedPhoto && (
                <Lightbox
                    photo={selectedPhoto}
                    onClose={() => handlePhotoSelect(null)}
                />
            )}

            {showLikesModal && (
                <LikesListModal
                    users={likesModalUsers}
                    onClose={() => setShowLikesModal(false)}
                />
            )}

        </>
    );
}
