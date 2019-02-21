import React, { Fragment, useState } from 'react';
import { DropdownMenu, ButtonDropdown, DropdownToggle, DropdownItem } from 'reactstrap';

const Playground = () => {

    const [toggleState, setToggleState] = useState({
        socialMedia: [
            {
                name: 'Instagram',
                toggle: false
            },
            {
                name: 'Facebook',
                toggle: false
            }
        ]
    });

    const toggle = elem => {
        const index = toggleState.socialMedia.findIndex(e => e.name === elem.name);
        const newState = { ...toggleState };
        newState.socialMedia[index].toggle = !newState.socialMedia[index].toggle;
        setToggleState(newState);
    }

    console.log(toggleState);

    return (
        <Fragment>
            <ul className="list-group float-left p-2 ml-3">
                {toggleState && toggleState.socialMedia.map(elem => (
                    <li className="list-group-item" key={elem.name}>
                        <ButtonDropdown isOpen={elem.toggle} toggle={() => toggle(elem)}>
                            <DropdownToggle caret>{elem.name}</DropdownToggle>
                            <DropdownMenu>
                                {/* <DropdownItem header>Header</DropdownItem>
                                <DropdownItem disabled>Action</DropdownItem>
                                <DropdownItem>Another Action</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Another Action</DropdownItem> */}
                                <DropdownItem>
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Card title</h5>
                                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                        </div>
                                    </div>
                                </DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </li>
                ))}
            </ul>
            <div className="card float-right position-absolute m-2" style={{ width: "80%", height: '90%', left: '15%' }}></div>
        </Fragment>
    );
}

export default Playground;