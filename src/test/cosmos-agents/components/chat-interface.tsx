"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMessage } from "@/components/user-message"
import { AssistantMessage } from "@/components/assistant-message"
import { StatusIndicator } from "@/components/status-indicator"
import { Send } from "lucide-react"
import { CosmosDBIcon } from "@/components/cosmos-db-icon"
import { motion, AnimatePresence } from "framer-motion"
import { Database, Zap, DollarSign, Shield, MoveRight, Lock } from "lucide-react"
import { ExampleCard } from "@/components/example-card"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessages, setStatusMessages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, statusMessages])

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus()
  }, [])

  // Update the handleSubmit function to properly reset the chat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStatusMessages(["Our Cosmos DB specialists are working on your request..."])

    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        setStatusMessages((prev) => [...prev, "Analyzing your e-commerce requirements..."])
      }, 1000)

      setTimeout(() => {
        setStatusMessages((prev) => [...prev, "Evaluating data modeling options..."])
      }, 2000)

      setTimeout(() => {
        setStatusMessages((prev) => [...prev, "Preparing recommendations..."])
      }, 3000)

      setTimeout(() => {
        const response = {
          role: "assistant" as const,
          content: `Azure Cosmos DB is an excellent choice for building a globally distributed e-commerce product catalog with millions of products. Here's why, along with guidance on data modeling considerations:

## Why Cosmos DB is Suitable:

1. **Global Distribution with Low Latency**:
   - Cosmos DB allows you to replicate your data across multiple regions, ensuring low-latency access for users worldwide.
   - It provides multi-region writes, which is beneficial for scenarios where updates to the catalog might come from different regions.

2. **Scalability**:
   - Cosmos DB is highly scalable and can handle millions of products with ease, supporting high throughput for reads and writes.

3. **Flexible Data Modeling**:
   - Cosmos DB supports schema-less data, making it ideal for storing diverse product attributes (e.g., electronics, clothing, etc.) without needing a predefined schema.

4. **APIs for Diverse Needs**:
   - The SQL API is typically the best choice for e-commerce catalogs due to its query capabilities and support for hierarchical JSON data.

5. **Consistency Models**:
   - Cosmos DB offers five consistency levels, allowing you to balance between strong consistency (for critical updates) and eventual consistency (for faster reads).

## Data Modeling for Product Catalog:

For your e-commerce product catalog, I recommend the following data model structure:

1. **Product Container**:
   - Document ID: Unique product identifier
   - Properties: name, description, brand, price, category, images, attributes
   - Partition key: Consider using category or brand depending on your query patterns

2. **Category Container**:
   - Document ID: Category identifier
   - Properties: name, description, parent category (for hierarchical categories)
   - Partition key: parent category or top-level category

3. **Inventory Container**:
   - Document ID: SKU or product variant identifier
   - Properties: productId, location, quantity, status
   - Partition key: location or productId

This model allows for efficient queries across your catalog while maintaining the flexibility to handle diverse product types.`,
        }

        setMessages((prev) => [...prev, response])
        setIsLoading(false)
        setStatusMessages([])

        // Focus the input field after response
        inputRef.current?.focus()
      }, 4000)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
      setStatusMessages([])
    }
  }

  // Add a new function to reset the chat
  const resetChat = () => {
    setMessages([])
    setInput("")
    setIsLoading(false)
    setStatusMessages([])
    // Focus the input field after reset
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // Export the resetChat function so it can be used by the Sidebar component
  return {
    resetChat,
    render: (
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              className="flex-1 flex flex-col items-center justify-center px-4 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 mb-6 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <CosmosDBIcon size={48} />
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-slate-900 dark:text-white mb-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Azure Cosmos DB Support Chat
              </motion.h1>
              <motion.p
                className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Chat with specialized Azure Cosmos DB agents to get expert advice on your database needs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full max-w-4xl"
              >
                <h3 className="font-medium text-slate-900 dark:text-white mb-3 text-center">
                  Select a topic to get started:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <ExampleCard
                    title="Data Modeling"
                    icon={Database}
                    color="bg-gradient-to-r from-blue-500 to-blue-700"
                    example="How should I model data for e-commerce applications?"
                    onSelect={setInput}
                  />

                  <ExampleCard
                    title="Performance & Scaling"
                    icon={Zap}
                    color="bg-gradient-to-r from-amber-500 to-orange-600"
                    example="What are best practices for optimizing query performance?"
                    onSelect={setInput}
                  />

                  <ExampleCard
                    title="Cost Optimization"
                    icon={DollarSign}
                    color="bg-gradient-to-r from-emerald-500 to-green-600"
                    example="How can I reduce costs in my database?"
                    onSelect={setInput}
                  />

                  <ExampleCard
                    title="Consistency Levels"
                    icon={Shield}
                    color="bg-gradient-to-r from-violet-500 to-purple-600"
                    example="When should I use each consistency level?"
                    onSelect={setInput}
                  />

                  <ExampleCard
                    title="Migration & Integration"
                    icon={MoveRight}
                    color="bg-gradient-to-r from-rose-500 to-pink-600"
                    example="How do I migrate from MongoDB to Cosmos DB?"
                    onSelect={setInput}
                  />

                  <ExampleCard
                    title="Security & Compliance"
                    icon={Lock}
                    color="bg-gradient-to-r from-slate-600 to-slate-800"
                    example="What security features does Cosmos DB provide?"
                    onSelect={setInput}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex-1 overflow-auto mb-4 space-y-4 py-4">
              <AnimatePresence>
                {messages.map((message, index) =>
                  message.role === "user" ? (
                    <UserMessage key={index} content={message.content} />
                  ) : (
                    <AssistantMessage key={index} content={message.content} />
                  ),
                )}

                {isLoading && <StatusIndicator statusMessages={statusMessages} />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>

        <motion.div
          className="sticky bottom-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pt-6 pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 backdrop-blur-sm rounded-lg p-2 border border-slate-200 dark:border-slate-700 shadow-lg"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Azure Cosmos DB..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className={`rounded-full ${
                !input.trim()
                  ? "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                  : "bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white"
              }`}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </motion.div>
      </div>
    ),
  }
}
