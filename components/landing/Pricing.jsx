import { CheckCheckIcon } from "lucide-react";
import React from "react";

function Pricing() {
    const pricingData = [
        {
            title: "Starter",
            price: "$0",
            features: [
                "100 Messages per month",
                "Community Support",
                "Average Model Access",
            ],
            iconColor: "text-zinc-600",
        },
        {
            title: "Popular",
            price: "$10",
            features: [
                "1500 Messages per month",
                "Community Support",
                "Basic Model Access",
            ],
            iconColor: "text-zinc-600",
        },
        {
            title: "Pro",
            price: "$18",
            features: [
                "Unlimited messages",
                "Priority Support",
                "Latest Model Access",
                "Custom Branding Options",
            ],
            iconColor: "text-indigo-600",
        },
    ];

    return (
        <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto text-center">
            <div className="mb-20 flex flex-col items-center">
                <h2 className="text-2xl md:text-5xl font-medium text-white tracking-tight mb-6">
                    Fair Pricing for everyone.
                </h2>
                <p className="text-xl text-zinc-500 font-light max-w-xl leading-relaxed">
                    We offer a free tier for small projects and affordable pricing for larger ones with no hidden fees.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-stretch">
                {pricingData.map((plan, i) => (
                    <div
                        key={i}
                        className="p-10 rounded-3xl border border-white/5 bg-zinc-900/20
                        flex flex-col text-center hover:bg-zinc-900/40 transition-colors max-w-[420px] w-full"
                    >
                        <h2 className="text-sm font-medium text-zinc-400 mb-2">
                            {plan.title}
                        </h2>

                        <div className="text-4xl font-medium text-white tracking-tight mb-6">
                            {plan.price}
                            <span className="text-lg text-zinc-600 font-light">/month</span>
                        </div>

                        <ul className="space-y-3 text-sm text-zinc-300 font-light">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-left">
                                    <span className="w-5 h-5 shrink-0 flex items-center justify-center mt-0.5">
                                        <CheckCheckIcon
                                            className={`${plan.iconColor} w-4 h-4`}
                                        />
                                    </span>
                                    <span className="leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="w-full py-3 mt-6 rounded-xl border border-white/10 text-white
                            hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                            Get Started
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Pricing;
