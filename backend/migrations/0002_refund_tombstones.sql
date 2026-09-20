CREATE TABLE revoked_transactions(environment TEXT NOT NULL, transaction_id TEXT NOT NULL, revoked_at INTEGER NOT NULL, PRIMARY KEY(environment,transaction_id));
-- Serialize refund-before-delivery and delivery-before-refund inside SQLite itself.
CREATE TRIGGER reject_revoked_purchase BEFORE INSERT ON purchases
WHEN EXISTS(SELECT 1 FROM revoked_transactions WHERE environment=NEW.environment AND transaction_id=NEW.transaction_id)
BEGIN SELECT RAISE(ABORT,'revoked transaction'); END;
CREATE TRIGGER apply_transaction_revocation AFTER INSERT ON revoked_transactions
BEGIN
 UPDATE accounts SET state=json_set(state,'$.gems',MAX(0,COALESCE(json_extract(state,'$.gems'),0)-(SELECT gems FROM purchases WHERE environment=NEW.environment AND transaction_id=NEW.transaction_id)),'$.gemDebt',COALESCE(json_extract(state,'$.gemDebt'),0)+MAX(0,(SELECT gems FROM purchases WHERE environment=NEW.environment AND transaction_id=NEW.transaction_id)-COALESCE(json_extract(state,'$.gems'),0)),'$.revision',revision+1),revision=revision+1 WHERE id=(SELECT account_id FROM purchases WHERE environment=NEW.environment AND transaction_id=NEW.transaction_id AND revoked_at IS NULL);
 UPDATE purchases SET revoked_at=NEW.revoked_at WHERE environment=NEW.environment AND transaction_id=NEW.transaction_id AND revoked_at IS NULL;
END;
