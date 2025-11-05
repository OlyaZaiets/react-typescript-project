import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.scss';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CircularIndeterminate } from '../Loader/Loader';
import { BookModal } from '../BookModal/BookModal';

export const Dashboard = () => {
  const { user, loading } = useAuth();
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const [readCount, setReadCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [planCount, setPlanCount] = useState(0);

  const[isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'read' | 'favorite' | 'toRead' | null>(null);
  const [booksList, setBooksList] = useState<any[]>([]);
  const [unsubscribeModal, setUnsubscribeModal] = useState<null | (() => void)>(null);

  useEffect(() => {
    if (loading || !user) return;

    const readRef = collection(db, 'users', user.uid, 'read');
    const favRef = collection(db, 'users', user.uid, 'favorite');
    const planRef = collection(db, 'users', user.uid, 'toRead');

    let snapshotsLoaded = 0;

    const unsubscribeRead = onSnapshot(readRef, (snapshot) => {
      setReadCount(snapshot.size);
      snapshotsLoaded++;
      if (snapshotsLoaded === 3) setIsLoadingDashboard(false);
    });

    const unsubscribeFav = onSnapshot(favRef, (snapshot) => {
      setFavCount(snapshot.size);
      snapshotsLoaded++;
      if (snapshotsLoaded === 3) setIsLoadingDashboard(false);
    });

    const unsubscribePlan = onSnapshot(planRef, (snapshot) => {
      setPlanCount(snapshot.size);
      snapshotsLoaded++;
      if (snapshotsLoaded === 3) setIsLoadingDashboard(false);
    });
    

    return () => {
      unsubscribeRead();
      unsubscribeFav();
      unsubscribePlan();
    }
  },[user, loading]);


  if (isLoadingDashboard) {
    return (
      <div className='loading-container'>
        <CircularIndeterminate />
        <p className='loader-text'>Fetching your reading stats...</p>
      </div>
    );
  }

  const openModal = async (type: 'read'| 'favorite'| 'toRead' ) =>  {
    setIsModalOpen(true);
    setModalType(type)

    if (!user) return;

    const callTypeRef = collection(db, 'users', user.uid, type);
    
    const unsubscribeTypeCall = onSnapshot(callTypeRef, (snapshot) => {
      const books = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log('📚 Books fetched from Firebase:', books);
      setBooksList(books);
    });
    setUnsubscribeModal(() => unsubscribeTypeCall);
  }

  const closeModal = () => {
    if (unsubscribeModal) unsubscribeModal(); // відписуємося від Firebase
    setUnsubscribeModal(null);
    setIsModalOpen(false);
    setBooksList([]);
    setModalType(null);
    };

  return (
    <section className='reading-dashboard'>
      <h1>Your Personalized Reading Dashboard</h1>
      <p className='intro'>
        Once logged in, manage your journey through Stephen King's vast universe.
        Your dashboard provides a central hub for tracking milestones and connecting with new titles.
      </p>

      <div className='reading-dashboard__cards'>
        <div className='card'>
          <h3>Read Books Overview</h3>
          <p>
            Keep track of all the stories you've conquered across Stephen King's universe.
            View completion dates, revisit favorite moments, and reflect on how your journey through fear and mystery has grown over time.
          </p>
        </div>
        <div className='card'>
          <h3>Favorites Collection</h3>
          <p>
            Your personal vault of unforgettable tales.
            Save the books that left a mark — from haunting classics to hidden gems — and return anytime to relive the ones that truly stayed with you.
          </p>
        </div>
        <div className='card'>
          <h3>To-Read List</h3>
          <p>
            Plan your next descent into the unknown.
            Add titles you're eager to explore, reorder them by priority, and watch your anticipation grow as your King reading quest continues.
          </p>
        </div>
      </div>

      <div className='reading-dashboard__stats'>
        <div className='stat-item' onClick={() => openModal('read')}>
          <h2>{readCount}</h2>
          <p>Books Read</p>
          <span>Total journey so far</span>
        </div>
        <div className='stat-item' onClick={() => openModal('favorite')}>
          <h2>{favCount}</h2>
          <p>Favorites </p>
          <span>Top chilling tales</span>
        </div>
        <div className='stat-item' onClick={() => openModal('toRead')}>
          <h2>{planCount}</h2>
          <p>Plan</p>
          <span>Future trip</span>
        </div>
      </div>

    {isModalOpen && (
      <BookModal
        books={booksList}
        title={
          modalType === 'read'
            ? 'Books You Have Read'
            : modalType === 'favorite'
            ? 'Your Favorite Books'
            : 'Books To Read'
        }
        closeModal={closeModal}
      />
      )}
    </section>
  );
};
