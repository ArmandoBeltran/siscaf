import '../../assets/css/expandable-item.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from "react";

function ExpandableItem({ title, line_content, children, isOpen: isOpenProp, onClick }) {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = typeof isOpenProp === 'boolean' ? isOpenProp : internalOpen;

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            setInternalOpen(!internalOpen);
        }
    }

    return (
        <div className="expandable-item">
            <div className="expandable-item-content" onClick={handleClick}>
                <div className="expandable-item-content-title">
                    <span>
                        <FontAwesomeIcon icon={open ? faArrowDown : faArrowRight} />
                    </span>
                    <h3 className="font-semibold ms-2">{title}</h3>
                </div>
                <div className="expandable-item-content-data">
                    {line_content}
                </div>
            </div>
            {open && <div className="pl-4 mt-2">{children}</div>}
        </div>
    );
}

export default ExpandableItem;