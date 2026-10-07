import React, { useEffect, useState } from 'react';
import { getVendorReviews, replyToReview } from '../services/api';
import { StarIcon } from '../components/Icons';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getVendorReviews()
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;
    setSaving(true);
    try {
      await replyToReview(reviewId, replyText);
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, reply: replyText } : r)));
      setReplyingTo(null);
      setReplyText('');
    } catch {
      alert('Failed to submit reply.');
    } finally {
      setSaving(false);
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3>Verified Customer Reviews</h3>
              {avg && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#F59E0B',
                    padding: '3px 8px',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    fontWeight: 800,
                  }}
                >
                  <StarIcon size={14} />
                  <span>{avg}</span>
                </span>
              )}
            </div>
            <p>Real-time customer feedback and ratings for your store</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748B' }}>
            <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'rgba(20,184,166,0.3)', borderTopColor: '#14B8A6' }} />
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: '#F59E0B' }}>
              <StarIcon size={48} />
            </div>
            <h3 style={{ color: '#CBD5E1', marginBottom: 8 }}>No reviews yet</h3>
            <p style={{ fontSize: '0.9rem' }}>Customer reviews for your products will appear here once orders are delivered.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map((rev) => (
              <div key={rev._id} style={{ padding: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#14B8A6)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                      {(rev.customerName || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#F1F5F9', fontSize: '0.95rem' }}>{rev.customerName}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 3, color: '#F59E0B' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} size={15} style={{ opacity: s <= rev.rating ? 1 : 0.25 }} />
                    ))}
                  </div>
                </div>
                <p style={{ margin: '0 0 10px', color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6 }}>{rev.comment}</p>

                {rev.reply && (
                  <div style={{ padding: '10px 14px', background: 'rgba(20,184,166,0.08)', borderRadius: 10, borderLeft: '3px solid #14B8A6', marginBottom: 8 }}>
                    <div style={{ fontSize: '0.76rem', color: '#14B8A6', fontWeight: 700, marginBottom: 4 }}>YOUR REPLY</div>
                    <p style={{ margin: 0, color: '#E2E8F0', fontSize: '0.87rem' }}>{rev.reply}</p>
                  </div>
                )}

                {replyingTo === rev._id ? (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      className="textarea"
                      rows={3}
                      placeholder="Write your official store response..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => handleReply(rev._id)} disabled={saving}>
                        {saving ? 'Posting...' : 'Post Reply'}
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setReplyingTo(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  !rev.reply && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => { setReplyingTo(rev._id); setReplyText(''); }}>
                      Reply to Customer
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
