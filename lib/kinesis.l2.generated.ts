// Copyright 2012-2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2022-07-27T17:43:38.052Z","fingerprint":"7c+OTKrLrESms4Y6dmaBNVfwFavFLHun0mKuKBfR2a0="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
import * as iam from '@aws-cdk/aws-iam';
import { CfnStream } from './kinesis.generated';
export interface IStream extends cdk.IResource {
    /**
     * The ARN of the stream.
     */
    readonly streamArn: string;
    /**
     * The name of the stream.
     */
    readonly streamName: string;
    grantRead(grantee: iam.IGrantable): iam.Grant;
    grantCreate(grantee: iam.IGrantable): iam.Grant;
    grantUpdate(grantee: iam.IGrantable): iam.Grant;
    grantList(grantee: iam.IGrantable): iam.Grant;
    grantDelete(grantee: iam.IGrantable): iam.Grant;
}
export interface StreamProps {
    readonly streamName?: string;
}
abstract class StreamBase extends cdk.Resource implements IStream {
    public abstract readonly streamArn: string;
    public abstract readonly streamName: string;
    public grant(grantee: iam.IGrantable, ...actions: string[]) {
        return iam.Grant.addToPrincipal({grantee, actions, resourceArns: [this.streamArn], scope: this })
    }
    public grantRead(grantee: iam.IGrantable) {
        return this.grant(grantee, 'kinesis:DescribeStreamSummary','kinesis:ListTagsForStream');
    }
    public grantCreate(grantee: iam.IGrantable) {
        return this.grant(grantee, 'kinesis:EnableEnhancedMonitoring','kinesis:DescribeStreamSummary','kinesis:CreateStream','kinesis:IncreaseStreamRetentionPeriod','kinesis:StartStreamEncryption','kinesis:AddTagsToStream','kinesis:ListTagsForStream');
    }
    public grantUpdate(grantee: iam.IGrantable) {
        return this.grant(grantee, 'kinesis:EnableEnhancedMonitoring','kinesis:DisableEnhancedMonitoring','kinesis:DescribeStreamSummary','kinesis:UpdateShardCount','kinesis:UpdateStreamMode','kinesis:IncreaseStreamRetentionPeriod','kinesis:DecreaseStreamRetentionPeriod','kinesis:StartStreamEncryption','kinesis:StopStreamEncryption','kinesis:AddTagsToStream','kinesis:RemoveTagsFromStream','kinesis:ListTagsForStream');
    }
    public grantList(grantee: iam.IGrantable) {
        return this.grant(grantee, 'kinesis:ListStreams');
    }
    public grantDelete(grantee: iam.IGrantable) {
        return this.grant(grantee, 'kinesis:DescribeStreamSummary','kinesis:DeleteStream','kinesis:RemoveTagsFromStream');
    }
}
export class Stream extends StreamBase {
    constructor(scope: constructs.Construct, id: string, props: StreamProps) {
        super(scope, id, { physicalName: props.streamName })
        new CfnStream(this, 'Resource', {
        });
    }
}
