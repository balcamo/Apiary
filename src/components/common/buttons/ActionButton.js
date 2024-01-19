import React from "react"

export default function ActionButton ({ label, action }) {
    return (
        <button className="btn btn-dark-blue" onClick={action}>{label}</button>
    )
}