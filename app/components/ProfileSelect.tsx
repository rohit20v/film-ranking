import React, {useEffect, useRef, useState} from 'react';
import '../styles/dropdown.css';
import {NavLink} from "@remix-run/react";

const ProfileSelect = ({pfp}: { pfp: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="avatar-container">
                <img
                    src={pfp}
                    alt="Profile"
                    className={'avatar'}
                    style={{cursor: 'pointer'}}
                    onClick={toggleDropdown}
                />
            </div>
            <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                <div className="dropdown-item">
                    <NavLink style={{textDecoration: "none"}} to={"./profile"}>
                        <span className={'item'}>Profile</span>
                    </NavLink>
                </div>
                <div className="dropdown-item">
                    <span className={'item'}>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileSelect;
