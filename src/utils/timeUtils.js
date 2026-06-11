export function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    } else if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins}m ago`;
    } else if (diffInSeconds < 86400) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInSeconds < 604800) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

export function formatMessageTime(dateString) {
    return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}
