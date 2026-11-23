import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { createClientOnlyFn } from "@tanstack/react-start";
import { ClientOnly } from "@tanstack/react-router";

export function LocalCountButton() {
    return <ClientOnly>
        <ClientSection />
    </ClientOnly>
}

function ClientSection() {
    const [count, setCount] = useState(loadCount);

    useEffect(() => {
        localStorage.setItem("count", count.toString() )
    }, [count]);

    return (
        <Button variant="outline" size="sm" 
        onClick={() => setCount((c)=>c+1)}>
            {count}
        </Button>
    )   
}

const loadCount = createClientOnlyFn(()  => {
    const storeCount = localStorage.getItem("count");
    return storeCount ? parseInt(storeCount) : 0;
})