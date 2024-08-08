import {TonConnectButton, useTonWallet} from "@tonconnect/ui-react";
import './header.scss';

export const Header = () => {
    let wallet = useTonWallet();
    if (wallet) {
        return (
            <div>
                {JSON.stringify(wallet)}
            </div>
        )
    }
    return <header>
        <span>My App with React UI</span>
        <TonConnectButton />
    </header>
}
