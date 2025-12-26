import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import BlockTitle from '../../components/UI/BlockTitle/BlockTitle';
import Button from '../../components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutUser } from '../../services/api-actions';
import styles from './profilepage.module.css';
import { updateProfileRequest, uploadAvatarRequest } from '../../services/saga-actions';
import Input from '../../components/UI/Input/Input';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { user, player, isFileUploading, isLoading } = useAppSelector(state => state.user);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        fullname: '',
        email: ''
    });
    useEffect(() => {
        if (isEdit && user) {
            setFormState({
                fullname: user.fullname || '',
                email: user.email || ''
            });
        }
    }, [isEdit, user]);

    const handleLogout = () => dispatch(logoutUser());

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            dispatch(uploadAvatarRequest(e.target.files[0]));
        }
    };

    const handleSaveProfile = (e: FormEvent) => {
        e.preventDefault();
        dispatch(updateProfileRequest(formState));
        setIsEdit(false);
    };

    const renderAvatarSection = () => (
        <div className={styles.avatarSection}>
            <div className={styles.imageWrapper}>
                <img 
                    src={user?.image || '/assets/default-user.png'} 
                    alt="User Avatar" 
                    className={styles.avatarImage}
                />
                {isFileUploading && <div className={styles.loaderOverlay}>Loading...</div>}
            </div>
            
            <label className={styles.uploadBtnLabel}>
                Change Photo
                <input 
                    type="file" 
                    hidden 
                    onChange={handleAvatarChange} 
                    accept="image/*"
                />
            </label>
        </div>
    );

    const renderViewMode = () => (
        <div className={styles.viewContainer}>
            <ul className={styles.profileList}>
                <li className={styles.profileListItem}>
                    <h3>UUID:</h3>
                    <p>{user?.uuid}</p>
                </li>
                <li className={styles.profileListItem}>
                    <h3>Username:</h3>
                    <p>{user?.username}</p>
                </li>
                <li className={styles.profileListItem}>
                    <h3>Full name:</h3>
                    <p>{user?.fullname || '-'}</p>
                </li>
                <li className={styles.profileListItem}>
                    <h3>E-mail:</h3>
                    <p>{user?.email || '-'}</p>
                </li>
                <li className={styles.profileListItem}>
                    <h3>Registration date:</h3>
                    <p>{user?.regdate ? new Date(user.regdate).toLocaleDateString() : 'unknown'}</p>
                </li>
                <li className={styles.profileListItem}>
                    <h3>IDs (User/Player):</h3>
                    <p>{`${user?.user_id} / ${player?.player_id}`}</p>
                </li>
            </ul>
            
            <div className={styles.actions}>
                <Button onClick={() => setIsEdit(true)}><span>Редактировать профиль</span></Button>
                <Button className={styles.logoutBtn} onClick={handleLogout}><span>Выйти</span></Button>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <form className={styles.editForm} onSubmit={handleSaveProfile}>
            <div className={styles.formGroup}>
                <label>Full Name</label>
                <Input 
                    type="text"
                    value={formState.fullname}
                    onChange={(e) => setFormState({...formState, fullname: e.target.value})}
                    placeholder="Enter full name"
                />
            </div>

            <div className={styles.formGroup}>
                <label>E-mail</label>
                <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    placeholder="Enter email"
                />
            </div>

            <div className={styles.actions}>
                <Button type="submit" disabled={isLoading}>
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
                <Button type="button" onClick={() => setIsEdit(false)} className={styles.cancelBtn}>
                    <span>Cancel</span>
                </Button>
            </div>
        </form>
    );

    return ( 
        <>
            <BlockTitle>PROFILE PAGE</BlockTitle>
            <div className={styles.profileContainer}> 
                {renderAvatarSection()}
                
                <h2 className={styles.chapterTitle}>
                    {isEdit ? 'Edit Personal Info' : 'Personal Info'}
                </h2>
                
                {isEdit ? renderEditMode() : renderViewMode()}
            </div>
        </>
    );
}
 
export default ProfilePage;

// import { useState } from 'react';
// import BlockTitle from '../../components/UI/BlockTitle/BlockTitle';
// import Button from '../../components/UI/Button/Button';
// import { useAppDispatch, useAppSelector } from '../../hooks';
// import { logoutUser } from '../../services/api-actions';
// import styles from './profilepage.module.css'

// const ProfilePage = () => {
//     const dispatch = useAppDispatch();
//     const data = useAppSelector(state => state.user)
//     const handleLogout = async () => await dispatch(logoutUser());
//     const [isEdit, setIsEdit] = useState<boolean>(false)
//     return ( 
//         <>
//             <BlockTitle>PROFILE PAGE</BlockTitle>
//             {/* <h1 className={styles.pageTitle}>PROFILE PAGE</h1> */}
//             <div className={styles.profileContainer}> 
//                 <h2 className={styles.chapterTitle}></h2>
//                 <ul className={styles.profileList}>
//                     <li className={styles.profileListItem}>
//                         <h3>UUID: </h3>
//                         <p>{data.user?.uuid}</p>
//                     </li>
//                     <li className={styles.profileListItem}>
//                         <h3>Username: </h3>
//                         <p>{data.user?.username}</p>
//                     </li>
//                     <li className={styles.profileListItem}>
//                         <h3>Full name: </h3>
//                         <p>{data.user?.fullname}</p>
//                     </li>
//                     <li className={styles.profileListItem}>
//                         <h3>E-mail: </h3>
//                         <p>{data.user?.email}</p>
//                     </li>
//                     <li className={styles.profileListItem}>
//                         <h3>Registration date: </h3>
//                         <p>{data.user?.regdate?.toString()}</p>
//                     </li>
//                     <li className={styles.profileListItem}>
//                         <h3>user and player id's: </h3>
//                         <p>{`uid:[${data.user?.user_id}] pid:[${data.player?.player_id}]`}</p>
//                     </li>
//                 </ul>
//                 <Button className={styles.logoutBtn} onClick={handleLogout}><span>Выйти</span></Button>
//             </div>
//         </>
//     );
// }
 
// export default ProfilePage;