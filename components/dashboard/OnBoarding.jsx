import React, { useState } from 'react'
import steps from '@/lib/data';
import { ArrowLeft, ArrowRight, SparkleIcon, SparklesIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

import toast, { Toaster } from "react-hot-toast"
const OnBoarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({ business_name: '', website_url: '', external_link: '' });
    const progress = ((currentStep + 1) / steps.length) * 100
    const STEPS = steps[currentStep]
    const Icon = STEPS.icon

    const handelBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
        }
    }
    const handelNext = () => {
        const currentField = steps[currentStep].field
        const value = formData[currentField]
        if (currentStep < 2 && (value === "")) return
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1)
        } else {
            handelSubmit()
        }
    }
    const handelSubmit = async () => {
        try {
            const response = await fetch("/api/business/detail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    business_name: formData.business_name,
                    website_url: formData.website_url,
                    external_link: formData.external_link
                })
            })
            await response.json()
            toast.success("Your detail is send to admin")
            setIsSubmitting(false)
            window.location.reload()
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }

    }
    return (
        <>
            <Toaster />
            <div className='w-full max-w-2xl mx-auto min-h-100  flex flex-col justify-center'>
                {/*proress bar*/}
                <div className='fixed top-0 left-0 h-1 bg-white/5 w-full'>
                    <div className='h-full bg-indigo-500 transition-all duration-300 ease-in-out' style={{ width: `${progress}%` }} />
                </div>
                {/*Heading*/}
                <h2 className='fixed top-6 right-6 md:top-8 md:right-8 text-xs font-medium uppercase text-zinc-600 tracking-widest  pointer-events-none fade-in'>Setup Your Account</h2>
                {isSubmitting ? (
                    <div className="flex flex-col items-center justify-center ">
                        <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-lg animate-bounce shadow-xl">
                            <SparkleIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="mt-4 text-sm text-zinc-300 uppercase tracking-wider font-semibold text-center">Saving your details...</p>
                        <p className="mt-1 text-xs text-zinc-500 text-center">Hang tight, this might take a few seconds</p>
                    </div>

                ) : (
                    <div className='flex  items-center justify-between mb-8'>
                        <div className='flex flex-col space-y-2'>
                            <span className='text-xs font-medium w-26 text-indigo-400 uppercase tracking-widest bg-indigo-300/13 rounded-sm p-2 mt-5 mb-5'>Steps {currentStep + 1} of {steps.length}</span>
                            <div className='space-y-6'>
                                <div className='space-y-1'>
                                    <h2 className='text-3xl  md:text-4xl  font-medium text-white leading-tight'>{STEPS.question}</h2>
                                    <p className='text-lg text-zinc-500 font-light'>{STEPS.description}</p>
                                </div>
                                <div className='relative group'>
                                    {STEPS.type === "textarea" ? (
                                        <Textarea value={formData[STEPS.field]}
                                            onChange={(e) => setFormData({ ...formData, [STEPS.field]: e.target.value })}
                                            placeholder={STEPS.placeholder}
                                            className="w-full bg-transparent  border-0 border-b border-white/10 text-xl md:text-2xl  py-4 pr-12  text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500  rounded-none h-auto shadow-none transition-colors resize-none" />
                                    ) : (
                                        <Input value={formData[STEPS.field]}
                                            onChange={(e) => setFormData({ ...formData, [STEPS.field]: e.target.value })}
                                            placeholder={STEPS.placeholder}
                                            className="w-full bg-transparent  border-0 border-b border-white/10 text-xl md:text-2xl  py-4 pr-12  text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500  rounded-none h-auto shadow-none transition-colors"

                                        />
                                    )}
                                    <div className='absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none '>
                                        <Icon className='w-6 h-6' />
                                    </div>
                                </div>
                                <div className='flex items-end justify-end gap-4 pt-8'>
                                    <div className='flex items-center gap-2'>
                                        {currentStep > 0 && (
                                            <Button size='icon' onClick={handelBack} className='rounded-full px-15 py-6 text-base group font-medium  border border-white text-white bg-[#050509] hover:bg-white hover:text-black hover:border-none transition-transform duration-300 hover:shadow-lg hover:shadow-white/10'>
                                                <ArrowLeft className='text-white group-hover:text-black' />
                                                Back
                                            </Button>
                                        )}
                                    </div>
                                    <Button size='icon' onClick={handelNext} className='rounded-full px-15 py-6 text-base  font-medium transition-all bg-white hover:bg-zinc-200 text-black duration-300 hover:shadow-lg hover:shadow-white/10'>
                                        {currentStep === steps.length - 1 ? "Submit" : "Continue"}
                                        {currentStep === steps.length - 1 ? (<SparklesIcon className='w-5 h-5 ' />) : (<ArrowRight className='w-5 h-5' />)}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default OnBoarding; 